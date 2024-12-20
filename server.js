const express=require("express");
app=express();
const server=require("http").createServer(app);
const io = require("socket.io")(server);
const {v4:uuidV4}=require("uuid");

const PORT=process.env.PORT||3000;


app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.redirect(`/${uuidV4()}`);
});

app.get("/:room",(req,res)=>{
    res.render("room",{roomId:req.params.room});
})

io.on("connection",socket=>{
    socket.on("joinRoom",(roomId,userId)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("userConnected",userId);

        socket.on("disconnect",()=>{
            socket.broadcast.to(roomId).emit("userDisconnectd",userId);
        })
    })
})

server.listen(PORT,()=>{
    console.log(`Server connected to ${PORT}`);
});

