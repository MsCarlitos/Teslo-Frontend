import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (jwtToken: string) => {

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'Mundo',
            authentication: jwtToken
        }
    });

    socket?.removeAllListeners()
    socket = manager.socket('/');

    addListeners();
}

const addListeners = ( ) => {
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsUl = document.querySelector('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected';
        // console.log('Connected');
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'disconnected';
        // console.log('Disconnected');
    });

    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach( clientId => {
            console.log(clientId)
            clientsHtml += `<li>${ clientId }</li>`
        });
        clientsUl.innerHTML = clientsHtml;
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if ( messageInput.value.trim().length <= 0 ) return;
        socket.emit('message-from-client', {
            id:'YO',
            message: messageInput.value
        });
        messageInput.value = ''
    });

    socket.on('message-from-server', (payload:{fullname:string, message:string}) => {
        const newMessage = `
            <li>
                <strong>${ payload.fullname }</strong>
                <span>${ payload.message }</span>
            </li>
        `
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.append(li);
    })
}