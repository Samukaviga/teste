const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 443;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , {
  debug:true
});

app.use('/peerjs', peer);
//app.set('view engine', 'ejs')
app.use(express.static('public'))

/*
app.get('/' , (req,res)=>{
  

}); */

app.get('/' , (req,res)=>{ //pega o parametro passado na URL
   
  res.send(console.log(uuidv4()));
  // res.render('index' , {RoomId:req.params.room}); //guarda o nome na variavel RoomId 
});

app.get('/:room' , (req,res)=>{ //pega o parametro passado na URL
   
   //res.render('sala' , {RoomId:'sala'}); //guarda o nome na variavel RoomId 
});



io.on("connection" , (socket)=>{
  
  socket.on('newUser' , (id , room)=>{ //Envia a solicitacao do ID e SALA e recebe
    
    //console.log(uuidv4());
    console.log(room);
    socket.join(room); //cria a sala e conecta a ela
    socket.to(room).broadcast.emit('userJoined' , id); //emite para todos clientes da sala menos para o conectado
    

    socket.on('disconnect' , ()=>{ //caso o usuario se desconect
        socket.to(room).broadcast.emit('userDisconnect' , id);
    })
  })

  socket.emit('enviando_id', uuidv4());



})
server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})
