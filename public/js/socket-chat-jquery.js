//Me permite renderizar y modificar el HTML.

var params = new URLSearchParams( window.location.search );

var nombre = params.get('nombre');
var sala = params.get('sala');

// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar')
var txtMensaje = $('#txtMensaje')
var divChatbox = $('#divChatbox')




//Funciones para renderizar users.
function renderizarUsuarios(personas) { // [{},{},{}] array de personas

    console.log(personas);

    var html = '';
    //parte del HTML que quiero generar de forma automatica, por ejemplo el nombre de la sala:
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    /*todo el HTML de divUsuarios será reemplazado por el html que acabamos de editar.*/
    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo) {
    
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';

        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }


    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners. 'a' es ancortype, seria cada <a></a>. Cuando se haga click en un arcortype, guardamos el id del user en 'id'.
divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id'); //obtenemos el id de cada data-id dentro de <a></a>

    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(event) {
    event.preventDefault()

    //para evitar que se manden mensajes vacios.
    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) { /*Esta function representa al callback del lado del server */
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
})
