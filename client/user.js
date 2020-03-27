const socket = io("http://localhost:3000");
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODUyODg1ODksImRhdGEiOnsiZmlyc3ROYW1lIjoiU2h1YmhhbSIsImxhc3ROYW1lIjoiVGhvcnZlIiwibW9iaWxlTnVtYmVyIjo5NzY0MjkyMTQ5LCJ1c2VySWQiOiI4bkE3bXBRRTIiLCJlbWFpbCI6InRob3J2ZXNodWhiYW1AZ21haWwuY29tIn0sImlhdCI6MTU4NTIwMjE4OX0.evzimDwuXpejS5rSX7_iDP0TGG6F7lzQYDn2f5LjlfA";
    const userId = "8nA7mpQE2";

let userMessage = {
    senderId : userId,
    receiverId : "Beu5wj5Zd"
}

function goOnline(){
    
    console.log("js loaded");
    
    socket.on("verify-user",(data)=>{
        console.log("cleint sideverify user");
        socket.emit("set-user",authToken);
        socket.emit("getonline-users","");
    });
    
    socket.on(userId,(data)=>{
        console.log(data);
    });
    
    socket.on("showonline-users",(list)=>{
        for(x of list){
            console.log(x.username);
        }
    });
}

$("#send").click(()=>{
    console.log("clicked");
    userMessage.message = $("#message").val();
    socket.emit("chat-msg",userMessage);
})

goOnline();