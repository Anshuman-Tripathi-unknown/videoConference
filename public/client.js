const socket=io("/");


const videoGrid=document.getElementById("video-grid");

const myPeer =new Peer({
    iceServers:[
        {
            urls:"stun:stun.stunprotocol.org"
        }
    ]
},{
    host:"/",
    port:"3001"
})

const peers={};
myPeer.on("open",id=>{
    
socket.emit("joinRoom",ROOM_ID,id);
})
const myVideo=document.createElement("video");
myVideo.muted=true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    addVideoStream(myVideo,stream);

    myPeer.on("call",call=>{
        
        call.answer(stream);
        
        const video=document.createElement("video");
        call.on("stream",userVideoStream=>{
            addVideoStream(video,userVideoStream);
        })
    })

    socket.on("userConnected",userId=>{
        setTimeout(()=>{
        connectToNewUser(userId,stream)},1000)
    })
})

socket.on("userDisconnected",userId=>{
    if(peers[userId]){
        peers[userId].close();
    }
})



function addVideoStream(video,stream){
    video.srcObject=stream;
    video.addEventListener("loadedmetadata",()=>{
        video.play();
    })
    videoGrid.append(video);
}

function connectToNewUser(userId,stream){
    const call=myPeer.call(userId,stream);
    const video=document.createElement("video");
    call.on("stream",userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
    call.on("close",()=>{
        video.remove();
    })

    peers[userId]=call;
}