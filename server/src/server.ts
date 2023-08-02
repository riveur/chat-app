import { createServer } from "node:http";
import express from "express";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3001

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

