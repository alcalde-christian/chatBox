const socket = io()

// SweetAlert de bienvenida ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

let user = ""
let flag = false

Swal.fire({
    icon: "info",
    title: "¡Bienvenido!",
    input: "text",
    text: "Escribe tu nombre para el chat",
    inputValidator: (value) => {
        if (!value) {
            return "Debes ingresar un nomnbre"
        } else {
            socket.emit("userConnected", {user: value})
        }
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    flag = true
    document.getElementById("myName").innerText = user
})


// Sockets para el envío de mensajes //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const chatBox = document.getElementById("chatBox")

chatBox.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value.trim()})
            chatBox.value = ""
        } else {
            Swal.fire({
                icon: "warning",
                title: "Aviso",
                text: "No se ha ingresado texto en el mensaje"
            })
        }
    }
})


// Socket para la recepción de mensajes ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

socket.on("messages", data => {
    const messages = document.getElementById("messages")
    messages.innerHTML = ""
    data.forEach(el => {
        messages.innerHTML += `
            <div>
                <strong>${el.user}: </strong>${el.message}
            </div>
        `
    })
})


// Socket para nuevos usuarios conectados /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

socket.on("newUser", data => {
    if (flag == true) {
        Swal.fire({
            toast: true,
            position: "top-end",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            text: `${data} se ha unido al chat`
        })
    }
})


// Socket para la desconexión de usuarios /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const closeChat = document.getElementById("closeChat")

closeChat.addEventListener("click", e => {
    socket.emit("closedChat", {user: user})
    const messages = document.getElementById("messages")
    messages.innerHTML += `
        <p class="closeTag">
            -- Se ha finalizado la comunicación --
        </p>
    `
    socket.disconnect()
    socket.off("messages")
    socket.off("newUser")
})

socket.on("closedChat", data => {
    Swal.fire({
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        text: `${data} ha abandonado el chat`
    })
})
