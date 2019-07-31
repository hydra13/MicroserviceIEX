const express = require('express');
const app = express();

// Settings
const { port, projectId, keyFilename } = require('./config');

// Routes
const clientApi = require('./Routes/ClientAPI');
const managementApi = require('./Routes/ManagementAPI');

// Parser
const Parser = require('./Parser');

// DBClient
// const DBClient = require('./DBClients/FileClient');
const DBClient = require('./DBClients/GCDClient');

// Input service
const service = require('./Services/IEXCloudService')

// const dbClient = new DBClient({ filePath: 'db.json' });
const dbClient = new DBClient({ projectId, keyFilename });
const parser = new Parser(dbClient, service);

app.use(express.json());
app.use((req, res, next) => {
    req.parser = parser;
    req.dbClient = dbClient;
    req.service = service;
    next();
})
app.use('/api/client', clientApi);
app.use('/api/management', managementApi);

app.listen(port, () => { console.log(`Server started (port - ${port})`); });
