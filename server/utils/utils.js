//este file es para facilitar la creacion de un objeto en socket-chat

const crearMensaje = (nombre, mensaje) => {
    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    }
}

module.exports = {crearMensaje};