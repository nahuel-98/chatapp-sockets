//Aca vamos a trabajar toda la info del chat. SOCKET-CLIENT

var socket = io();

const querystring = window.location.search /*?q=pisos+en+barcelona&ciudad=Barcelona */

var params = new URLSearchParams( querystring ); //tenemos un objeto con informacion que podemos recuperar, en este caso el nombre

//Si no tiene el query 'nombre' o 'sala' en params, entonces redirecciona al index.html donde se va a registar
if( !params.has('nombre') || !params.has('sala')){
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

//objeto que voy a mandar al server al conectarme desde el socket-client
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};


socket.on('connect', function() {
    console.log('Conectado al servidor');

    //uso esto para que cuando me conecte le llegue esto al server
    socket.emit('entrarChat', usuario , function(resp) {
        console.log('users conectados ', resp)
    }) //si me conecto, ejecuto un callback (3er arg) que es la respuesta del server. Me interesa saber lista de users conectados
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});


//Escuchar cambios de usuarios, cuando un user entra o sale del chat.
socket.on('listaPersonas', function(personas) {

    console.log(personas); //lo imprime en la consola del cliente

});

//Mensajes privados
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje privado: ', mensaje)
})