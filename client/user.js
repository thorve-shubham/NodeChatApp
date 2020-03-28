const socket = io("http://localhost:3000");
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODU0NjM1MDcsImRhdGEiOnsiZmlyc3ROYW1lIjoiU2h1YmhhbSIsImxhc3ROYW1lIjoiVGhvcnZlIiwibW9iaWxlTnVtYmVyIjo5NzY0MjkyMTQ5LCJ1c2VySWQiOiI4bkE3bXBRRTIiLCJlbWFpbCI6InRob3J2ZXNodWhiYW1AZ21haWwuY29tIn0sImlhdCI6MTU4NTM3NzEwN30.PwbYmQTNkMdYRWrJ0FMx3t6TnxTOomGcd0WiD_-L0wo";
    const userId = "8nA7mpQE2";

let userMessage = {
    senderId : userId,
    receiverId : "Beu5wj5Zd",
    senderName : "Shubham Thorve",
    receiverName : "Shubham Thorve1"
}

function goOnline(){
    
    console.log("js loaded");
    
    socket.on("verify-user",(data)=>{
        console.log("cleint sideverify user");
        socket.emit("set-user",authToken);
        //socket.emit("getonline-users","");
    });
    
    socket.on(userId,(data)=>{
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
    console.log("clicked");
    userMessage.message = $("#message").val();
    socket.emit("chat-msg",userMessage);
});

$("#message").on('keypress',function(){
    socket.emit('typing',"User 1");
});

goOnline();