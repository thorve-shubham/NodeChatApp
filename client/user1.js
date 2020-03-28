const socket = io("http://localhost:3000");
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODU0NjM0MDEsImRhdGEiOnsiZmlyc3ROYW1lIjoiU2h1YmhhbSIsImxhc3ROYW1lIjoiVGhvcnZlIiwibW9iaWxlTnVtYmVyIjo5NzY0MjkyMTQ5LCJ1c2VySWQiOiJCZXU1d2o1WmQiLCJlbWFpbCI6InRob3J2ZXNodWJoYW1AZ21haWwuY29tIn0sImlhdCI6MTU4NTM3NzAwMX0.FDHGZTg221oZ14q8qffa8Qc5p2xGihRcakOAUq7AQYM";
    const userId = "Beu5wj5Zd";

let userMessage = {
    senderId : userId,
    receiverId : "8nA7mpQE2",
    senderName : "Shubham Thorve1",
    receiverName : "Shubham Thorve" 
}

function goOnline(){
    
    console.log("js loaded");
    
    socket.on("verify-user",(data)=>{
        console.log("cleint sideverify user");
        socket.emit("set-user",authToken);
        //socket.emit("getonline-users","");
    });
    
    socket.on(userId,(data)=>{
        console.log("handleing user eveent");
        console.log(data);
    });
    
    socket.on("showonline-users",(list)=>{
        console.log(list);
    });

    socket.on('istyping',(data)=>{
        console.log(data + " is Typing");
    });
}

$("#send").click(()=>{
    userMessage.message = $("#message").val();
    socket.emit("chat-msg",userMessage);
});

$("#message").on('keypress',function(){
    socket.emit('typing',"User 2");
});

goOnline();