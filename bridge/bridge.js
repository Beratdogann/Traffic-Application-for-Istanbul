import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import zmq from 'zeromq';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// CORS yapılandırması
app.use(cors({
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: 'http://localhost:8081' }
});

// REQ/REP: Trafik verisini almak için HTTP POST
app.post('/traffic', async (req, res) => {
    const { lat, lon } = req.body;

    console.log(`Gelen istek - Lat: ${lat}, Lon: ${lon}`);

    try {
        const reqSocket = new zmq.Request();
        console.log("ZeroMQ isteği başlatılıyor...");
        await reqSocket.connect('tcp://localhost:5559');
        console.log("ZeroMQ bağlantısı kuruldu.");

        await reqSocket.send(`${lat}, ${lon}`);
        const [reply] = await reqSocket.receive();

        try {
            const parsed = JSON.parse(reply.toString());
            console.log("JSON yanıt başarıyla parse edildi.");
            res.json(parsed);
        } catch (e) {
            console.error("JSON PARSE HATASI:", reply.toString());
            res.status(500).json({ error: "Cevap parse edilemedi", raw: reply.toString() });
        }
    } catch (err) {
        console.error("ZeroMQ hata:", err);
        res.status(500).json({ error: "Veri alınamadı", details: err.message });
    }
});

// PUB/SUB: Trafik verilerini dinleyip WebSocket ile yayınlamak
const subSocket = new zmq.Subscriber();
subSocket.connect('tcp://localhost:5558');
subSocket.subscribe('traffic');

// ZeroMQ'dan gelen veriyi dinleyip WebSocket ile frontend'e iletmek
const receiveSub = async () => {
    for await (const [msg] of subSocket) {
        const data = msg.toString();
        console.log("Yeni trafik verisi alındı:", data);

        io.emit("traffic_update", data); // WebSocket üzerinden veriyi gönder
    }
};

// WebSocket bağlantısı kurulduğunda bilgilendirme
io.on('connection', (socket) => {
    console.log('WebSocket bağlandı:', socket.id);

    // Bağlantı koptuğunda bilgilendirme
    socket.on('disconnect', () => {
        console.log('WebSocket bağlantısı kesildi:', socket.id);
    });
});

// Sunucuyu başlat
server.listen(3000, () => {
    console.log('Köprü servisi http://localhost:3000 üzerinde çalışıyor');
});
