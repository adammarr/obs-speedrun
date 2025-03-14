import express from 'express';
import expressWs from 'express-ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
expressWs(app); // Enable WebSocket support
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'web/speedrun/dist/speedrun'), { index: "index.html"}));
app.use('/images', express.static(path.join(__dirname, 'public')));

const clients = new Set();

app.ws('/ws', (ws, req) => {
    console.log("Client connected");
    clients.add(ws);

    ws.on('message', msg => {
        console.log(`Received: ${msg}`);
        // Broadcast the message to all connected clients
        clients.forEach(client => {
            if (client.readyState === 1) { // Check if the connection is open
                client.send(`${msg}`);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    ws.onerror = error => {
        console.error('WebSocket error:', error);
    };
});

app.use('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'web/speedrun/dist/speedrun/index.html'));
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);