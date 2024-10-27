const peer = new Peer({
    host: 'localhost',
    port: 3000,
    path: '/peerjs'
  });
  
  const peerIdDisplay = document.getElementById('peer-id');
  const connectBtn = document.getElementById('connect-btn');
  const peerIdInput = document.getElementById('peer-id-input');
  const chatDiv = document.getElementById('chat');
  const connectedPeerIdDisplay = document.getElementById('connected-peer-id');
  const messageBox = document.getElementById('message-box');
  const sendBtn = document.getElementById('send-btn');
  const messagesDiv = document.getElementById('messages');
  const screenVideo = document.getElementById('screen-video');
  const shareScreenBtn = document.getElementById('share-screen-btn');
  
  let conn;
  let screenStream;
  
  // Display own peer ID
  peer.on('open', (id) => {
    peerIdDisplay.innerText = id;
  });
  
  // Connect to another peer when "Connect" is clicked
  connectBtn.addEventListener('click', () => {
    const targetPeerId = peerIdInput.value;
    if (targetPeerId) {
      conn = peer.connect(targetPeerId);
      setupConnection();
    }
  });
  
  // Set up connection handlers
  function setupConnection() {
    conn.on('open', () => {
      chatDiv.style.display = 'block';
      connectedPeerIdDisplay.innerText = conn.peer;
    });
  
    // Handle incoming messages
    conn.on('data', (data) => {
      const messageElement = document.createElement('p');
      messageElement.textContent = `Peer: ${data}`;
      messagesDiv.appendChild(messageElement);
    });
  }
  
  // Listen for incoming connections
  peer.on('connection', (incomingConn) => {
    conn = incomingConn;
    setupConnection();
  });
  
  // Send message to the connected peer
  sendBtn.addEventListener('click', () => {
    const message = messageBox.value;
    if (conn && message) {
      conn.send(message);
      const messageElement = document.createElement('p');
      messageElement.textContent = `You: ${message}`;
      messagesDiv.appendChild(messageElement);
      messageBox.value = '';
    }
  });
  
  // Handle Screen Sharing
  shareScreenBtn.addEventListener('click', async () => {
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const call = peer.call(conn.peer, screenStream);
  
      // Display the shared screen on the video element
      screenVideo.style.display = 'block';
      screenVideo.srcObject = screenStream;
  
      // Stop sharing when the stream ends
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        screenVideo.style.display = 'none';
        if (call) call.close();
      });
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  });
  
  // Listen for incoming screen sharing calls
  peer.on('call', (call) => {
    call.answer();
    call.on('stream', (remoteStream) => {
      screenVideo.style.display = 'block';
      screenVideo.srcObject = remoteStream;
    });
  });
  

  function copyID() {
    // Select the text element
    const text = document.getElementById("peer-id").innerText;

    // Copy text to clipboard
    navigator.clipboard.writeText(text).then(() => {
        // alert("Text copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy text:", err);
    });
}