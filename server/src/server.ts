import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import * as usersController from "./controllers/users";
import authMiddleware from "./middlewares/auth";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("API is UP!");
});

app.post("/api/users", usersController.register);
app.post("/api/users/login", usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);

io.on('connection', () => {
    console.log("connection established");
});

mongoose.connect('mongodb://localhost:27017/trello').then(() => {
    console.log("mongodb connection established");
    httpServer.listen(4001, () => {
        console.log("API is listening on port 4001!")
    });
});

