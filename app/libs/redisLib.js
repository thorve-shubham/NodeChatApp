const redis = require('redis');
const client = redis.createClient()

client.on('connect',()=>{
    console.log("Redis got connected");
})

function getAllOnlineUsers(hashName,cb){
    client.HGETALL(hashName,(err,users)=>{
        console.log('getting data for '+ hashName);
        if(err){
            console.log("something went wrong");
            cb(err,null);
        }else if (users==null || users==undefined || users == ""){
            console.log("empty data found");
            cb(null,{});
        }else{
            console.log(users);
            cb(null,users);
        }
    });
}

function setUserOnline(hashName,key,value,cb){
    client.HMSET(hashName,[key,value],(err,user)=>{
        if(err){
            console.log("something went wrong");
            cb(err,null);
        }else{
            console.log("user set online");
            console.log(user);
            cb(null,user);
        }
    });
}

function deleteUser(hashName,key,cb){
    client.HDEL(hashName,key);
    return true;
}


module.exports.getAllOnlineUsers = getAllOnlineUsers;
module.exports.setUserOnline = setUserOnline;
module.exports.deleteUser = deleteUser;
