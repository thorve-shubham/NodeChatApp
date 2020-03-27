const socket = io("http://localhost:3000");
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODUzNzM4MjksImRhdGEiOnsiZmlyc3ROYW1lIjoiU2h1YmhhbSIsImxhc3ROYW1lIjoiVGhvcnZlIiwibW9iaWxlTnVtYmVyIjo5NzY0MjkyMTQ5LCJ1c2VySWQiOiJCZXU1d2o1WmQiLCJlbWFpbCI6InRob3J2ZXNodWJoYW1AZ21haWwuY29tIn0sImlhdCI6MTU4NTI4NzQyOX0.KC74s4uMaJFhlyA8HWymA9DUG2DWbwGNVH6F_qEcQY4";
    const userId = "Beu5wj5Zd";

let userMessage = {
    senderId : userId,
    receiverId : "8nA7mpQE2"
}

function goOnline(){
    
    console.log("js loaded");
    
    socket.on("verify-user",(data)=>{
        console.log("cleint sideverify user");
        socket.emit("set-user",authToken);
        socket.emit("getonline-users","");
    });
    
    socket.on(userId,(data)=>{
        console.log("handleing user eveent");
        console.log(data);
    });
    
    socket.on("showonline-users",(list)=>{
        for(x of list){
            console.log(x.username);
        }
    });
}

$("#send").click(()=>{
    userMessage.message = $("#message").val();
    socket.emit("chat-msg",userMessage);
})

goOnline();