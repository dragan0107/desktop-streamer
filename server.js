const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');



const app = express();
const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// Serve the frontend HTML file
app.use(express.static('public'));

// Initialize the PeerServer with the exact path /peerjs
app.use('/peerjs', peerServer);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


