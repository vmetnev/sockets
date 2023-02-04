const {
    urlencoded
} = require('express');

let thisMessage

const express = require('express')
const app = express();
const path=require('path')
const http = require('http').Server(app);
const io = require('socket.io')(http);

//  middleware to handle form data
app.use(express.urlencoded({
    extended: false
}))



// middleware for handing json data
app.use(express.json())
app.use('/', express.static(path.join(__dirname, '/public')))

// this is for historical messages
const messages = [{
    'user': 'first',
    'message': 'hihi'
}, {
    'user': 'second',
    'message': 'hello'
}, {
    'user': 'third',
    'message': 'salut'
}]

const users = {}

users['324262423436'] = 'vlad'

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// this is to give historical messages to new connection
app.get('/messages', (req, res) => {
    res.json({
        'message': 'ok',
        'messages': messages
    })
})



io.on('connection', function (socket) {
    console.log('a new user connected ', socket.id);

    socket.on('disconnect', function () {
        console.log('user disconnected');
        console.log(socket.id)
    });


    socket.on('chat message', function (msg) {
        let thisId = users[socket.id]
        thisMessage = {
            'user': thisId,
            'message': msg
        }
        messages.push(thisMessage)
        io.emit('chat message', thisMessage);
    });


    socket.on('registration', function (regObject) {
        console.log('registration')
        console.log(regObject)
        io.emit('chat message', {
            user: regObject.name,
            message: 'joint'
        });
        users[regObject.id] = regObject.name
        console.log(users)

    })


});





http.listen(5000, function () {
    console.log('listening on port: 5000');
});