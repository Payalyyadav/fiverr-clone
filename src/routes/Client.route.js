const express = require('express');
const { register, login, logout, clients, edit_details, client } = require('../Controllers/client/client');
const verification = require('../middleware/Client.auth');

const clientRouter = express.Router();

clientRouter.post("/register", register)
clientRouter.post("/login", login)
clientRouter.get("/fetch", verification, clients)
clientRouter.get("/fetch/by/:id", verification, client)
clientRouter.post("/logout", verification, logout)
clientRouter.post("/edit-detail", verification, edit_details)

module.exports = clientRouter;
