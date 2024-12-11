const express = require('express');
const { v4: uuidv4 } = require('uuid');
const os = require('os');
const bodyParser = require('body-parser');
const cors = require('cors');
const recipeRoutes = require('./routes/recipeRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/recipes', recipeRoutes);
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    const requestId = uuidv4();
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start; 
        console.log(`[${requestId}] ${req.method} ${req.url} [${res.statusCode}] - ${duration}ms`);
    });

    req.requestId = requestId;
    next();
});

// Информация о сервере
app.get('/api/server-info', (req, res) => {
    const serverInfo = {
        hostname: os.hostname(),
        platform: os.platform(),
        architecture: os.arch(),
        uptime: os.uptime(),
        memory: {
            free: os.freemem(),
            total: os.totalmem(),
        },
        cpus: os.cpus(),
    };

    res.json(serverInfo);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});