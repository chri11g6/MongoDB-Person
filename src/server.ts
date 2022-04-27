import { createServer } from 'http';
const app = require('./app');

const port = process.env.PORT || 3000;

const server = createServer(app);

server.listen(port);