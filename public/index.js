const socket = io('/');

const peer = new Peer({
	config: {'iceServers': [
    { url: 'stun:stun.2.google.com:19302', credential: 'homeo' },
    {
      urls: 'turn:relay1.expressturn.com:3478',
      username: 'ef9THPOJWDL9NUUK7Z',
      credential: '2Lsp3PJPVTjMOfPh'
    } 

	]} /* Sample servers, please use appropriate ones */
  
  }); 

/*

const peer = new Peer({
	config: {'iceServers': [
	  { url: 'stun:stun.l.google.com:19302' },
	  { url: 'stun:stun.2.google.com:19302', credential: 'homeo' }
	]} /* Sample servers, please use appropriate ones 
  
  });      

*/
let myVideoStream;
let myId;

var videoGrid = document.getElementById('videos') 
//var myvideo = document.createElement('video'); //criando um elemento video

myvideo = document.querySelector('#user-1');


myvideo.muted = true; //deixando o elemento video MUTADO

const peerConnections = {}

navigator.mediaDevices.getUserMedia({ //solicitando a permicao do uso da camera
  video:true,
  //audio:true
}).then((stream)=>{ //stream sao os dados que estao vindo da camera THEN seria a promessa

  myVideoStream = stream; // Dados da camera
  //window.localStream = stream
  //window.localStream.autoplay = true;
  myvideo.srcObject = stream; //passando os dados da camera para o srcObject

  //addVideo(myvideo , stream); //adicionando o video mais os dados no Index

  peer.on('call' , call => { //fica escutando para atender a chamada

    call.answer(stream); //atende a chamada

     // const vid = document.createElement('video');
        const myvideo2 = document.querySelector('#user-2')
    call.on('stream' , userStream => {  //steam é MediaStream do peer remoto, os dados da camera 
      //addVideo(vid , userStream);
       
        myvideo2.srcObject = userStream; 
        videoGrid.append(myvideo2);

    })

    call.on('error' , (err)=>{
      alert(err)
    })

    call.on("close", () => {
        //console.log(vid);
       // vid.remove();
    })

    peerConnections[call.peer] = call;
  })
  
}).catch(err=>{
    alert(err.message)
})


peer.on('open' , (id)=>{ //Peer cria um ID aleatorio
  myId = id;
 
  socket.emit("newUser" , id , roomName); //retorna o ID criado pelo Peer 
})

peer.on('error' , (err)=>{
  alert(err.type);
});


socket.on('userJoined' , id =>{ //recebendo o ID do cliente conectado
 
  console.log("novo usuario conectado")

  const call  = peer.call(id , myVideoStream); //realizando uma chamada

  //const vid = document.createElement('video'); //criando o elemento de VIDEO
  const myvideo2 = document.querySelector('#user-2')

  call.on('error' , (err)=>{ //caso a chamada de erro
    alert(err);
  })

  call.on('stream' , userStream => {  //steam é MediaStream do peer remoto 
    //addVideo(vid , userStream);
   
    myvideo2.srcObject = userStream
    
    videoGrid.append(myvideo2);


  })

  call.on('close' , ()=>{ //fechando a chamada
    //myvideo2.remove();
    // vid.remove();
    console.log("usuario desconectado")
  })



  peerConnections[id] = call;

})

socket.on('userDisconnect' , id=>{
  if(peerConnections[id]){
    peerConnections[id].close();
  }
})

function addVideo(video , stream){ //funcao de adicionar VIDEO. 1- Paramento: Elemento Video 2- dados vindo da camera
  
  video.srcObject = stream; //passando os dados da camera para o srcObject

 

  video.addEventListener('loadedmetadata', () => {
    video.play()
  })

  videoGrid.append(video);
}


const sair = document.querySelector('#sair');

console.log(sair);

sair.addEventListener('click', () => {
     
          window.location.href = '/';
});
