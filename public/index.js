let service = "name" //chat
const socket = io();

// нужно сохранять session storage 
// implement list of users from button on the righ - get users
// implement private rooms

const messages = document.querySelector('.messages')
const form = document.querySelector('.form')
const input = document.querySelector('.input')
const button = document.querySelector('.button')
const clear = document.querySelector('.clear')

form.addEventListener('submit', handleFormSubmit)
button.addEventListener('click', () => {
    console.log('click')
    handleFormSubmit(event)
})

clear.addEventListener('click', () => {
    input.value=""
})

input.addEventListener('keydown',(evt)=>{
    
    if(evt.code==="Enter" || evt.code==="NumpadEnter" ) handleFormSubmit(evt)
})

// get and add previous messages
fetch('/messages')
    .then(response => response.json())
    .then((data) => {
        console.log(data)
        data.messages.forEach((item) => {
            appendMessageLine(item)
        })
    });


socket.on('chat message', function (msg) {
    console.log(socket.id)
    console.log('chat message from outside')
    appendMessageLine(msg)
});


function appendMessageLine(textLineObject) {
    let messageLine = document.createElement('li')
    messageLine.innerHTML = `<a class="user-name">${textLineObject.user}></a> ${textLineObject.message}`
    messages.append(messageLine)
}

function handleFormSubmit(event) {
    event.preventDefault()
    if (service === 'name') {
        let regObject = {}
        regObject.name = input.value
        regObject.id = socket.id
        socket.emit('registration', regObject);
        service = 'chat'
        input.value = ""
        input.setAttribute('placeholder','Enter your message')
        button.textContent = "send"
        return
    }

    let message = input.value
    document.querySelector('.input').value = ""
    socket.emit('chat message', message);
}