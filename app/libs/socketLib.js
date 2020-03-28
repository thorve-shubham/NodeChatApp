const socket = require('socket.io');
const tokenLib = require('./tokenLib');
const shortId = require('shortid');
const events = require('events');
const Chat = require('../Models/chat');
const redisLib = require("../libs/redisLib");

const eventEmitter = new events.EventEmitter();

function setUser(app){

    

    let allOnlineUsers = [];

    let io = socket.listen(app);

    let mainSocket = io.of('');

    mainSocket.on("connection",(socket)=>{
        socket.emit("verify-user","");

        console.log("server emitted verify user");

        socket.on("set-user",(authToken)=>{
            console.log("inside set user");
            tokenLib.comapreToken(authToken,(err,user)=>{
                if(err){
                    console.log("auth failed");
                    socket.emit('auth-error',{status:503,Msg : "Authentication failed"});
                }else{
                    let currentUser = user.data;
                    socket.user = currentUser.userId;
                    console.log(socket.user);
                    console.log(currentUser.firstName + " "+currentUser.lastName);
                    let key = currentUser.userId;
                    let value = currentUser.firstName + " "+currentUser.lastName;  
                    redisLib.setUserOnline('onlineUsers',key,value,(err,user)=>{
                        if(err){
                            console.log("user was unable to set online");
                        }else{
                            redisLib.getAllOnlineUsers("onlineUsers",(err,result)=>{
                                if(err){
                                    console.log("unable to get onlne users");
                                }else{
                                    console.log(currentUser.firstName+" set online");
                                    socket.join('mygroup');
                                    socket.to('mygroup').broadcast.emit("showonline-users",result);
                                    socket.emit(currentUser.userId,"You are online");
                                }
                            })
                            
                        }
                    });
                   // allOnlineUsers.push({userId : currentUser.userId, username : currentUser.firstName+" "+currentUser.lastName});
                }
            });
        });

        // socket.on("getonline-users",()=>{
        //     socket.emit("showonline-users",allOnlineUsers);
        // });

        socket.on("disconnect",()=>{
            redisLib.deleteUser("onlineUsers",socket.user);
            redisLib.getAllOnlineUsers("onlineUsers",(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(socket.user + " got disconnected");
                    socket.to('mygroup').broadcast.emit("showonline-users",result);
                    socket.leave('mygroup');
                }
            })
            
        });
        socket.on("chat-msg",(userMessage)=>{
            console.log("got messaeg");
            userMessage.chatId = shortId.generate();
            userMessage.chatRoom = 'mygroup';
            eventEmitter.emit("save-chat",userMessage);
            mainSocket.emit(userMessage.receiverId,userMessage);
        });
        socket.on('typing',(data)=>{
            socket.to('mygroup').broadcast.emit('istyping',data);
        })
    });
} 

eventEmitter.on('save-chat',(data)=>{
    let chatObj = new Chat({
        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName,
        receiverId: data.receiverId,
        message: data.message,
        chatRoom: data.chatRoom
    });

    chatObj.save((err,result)=>{
        if(err){
            console.log("save failed");
        }else{
            console.log("chat saved Successfully");
        }
    })
})

module.exports.setUser = setUser;