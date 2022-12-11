//SOCKET SERVER
const { io } = require('../server');
const {crearMensaje} = require('../utils/utils')

const { Usuarios} = require('../classes/usuarios');
const Client = require('socket.io/lib/client');
const usuarios = new Usuarios(); //al llamar Usuarios(), inicializa a personas = []

//Cada vez que un User se conecta (refresca la pagina o entra por 1era vez), se ejecuta on connection y todo lo que está dentro de esa función.
io.on('connection', (client) => {
    
    client.on('entrarChat', (data, callback) =>{
        
        //data es la info que envía el socket-chat, que es el nombre de usuario
        if( ! data.nombre || ! data.sala){
            return callback({
                error: true,
                mensaje: "El nombre/sala es necesario"
            })
        }
        client.join(data.sala) //to join a room

        usuarios.agregarPersona(client.id, data.nombre, data.sala); //agregarPersona agrega el nuevo usuario y retorna todas las personas que están conectadas al servidor.

        //al conectarse un user a una sala, emite un array con las personas que están conectadas a la sala a todos los users conectados a la misma sala.
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala))
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));
        
        callback(usuarios.getPersonasPorSala(data.sala)); //retorno las personas conectadas a la sala de chat
    })

    client.on('crearMensaje', (data) =>{

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje( persona.nombre, data.mensaje)

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    })

    client.on('disconnect', () =>{
        //persona es un obj con 3 atributos: nombre, id y sala
        let personaBorrada =usuarios.borrarPersona( client.id ) //esto almacena la persona borrada.

        //se emite el mensaje para todos los users conectados
        // client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`))

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`))
        //emite lista de personas conectadas luego de que alguien se desconecte
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))
    })

    //Mensajes privados
    client.on('mensajePrivado', data =>{

        let persona = usuarios.getPersona(client.id)
        //con la fx to() estamos diciendo que lo envíe a todo el que tenga dicho ID (puede ser una o varias personas)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
        
    })

});