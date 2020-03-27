const socket = require('socket.io');
const tokenLib = require('./tokenLib');

function setUser(app){

    let allOnlineUsers = [];

    let io = socket.listen(app);

    let mainSocket = io.of('');

    mainSocket.on("connection",(socket)=>{
        socket.emit("verify-user","");

        console.log("server emitted verify user");

        socket.on("set-user",(authToken)=>{
            tokenLib.comapreToken(authToken,(err,user)=>{
                if(err){
                    socket.emit('auth-error',{status:503,Msg : "Authentication failed"});
                }else{
                    let currentUser = user.data;
                    socket.user = currentUser.userId;
                    console.log(socket.user);
                    console.log(currentUser.firstName + " "+currentUser.lastName);
                    allOnlineUsers.push({userId : currentUser.userId, username : currentUser.firstName+" "+currentUser.lastName});
                    socket.emit(currentUser.userId,"You are online");
                }
            });
        });

        socket.on("getonline-users",()=>{
            socket.emit("showonline-users",allOnlineUsers);
        });

        socket.on("disconnect",()=>{
            console.log(socket.user + " got disconnected");
        });
        socket.on("chat-msg",(userMessage)=>{
            console.log("got messaeg");
            mainSocket.emit(userMessage.receiverId,userMessage);
        })
    });
} 

module.exports.setUser = setUser;