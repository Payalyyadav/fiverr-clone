const express = require('express');
const { register, login, logout, clients, edit_details, client, clientDelete,  resetPassword, changePassword } = require('../Controllers/client/client');
const verification = require('../middleware/Client.auth');

const clientRouter = express.Router();

clientRouter.post("/register", register)
clientRouter.post("/login", login)
clientRouter.get("/fetch", verification, clients)
clientRouter.get("/fetch/by/:id", verification, client)
clientRouter.post("/logout", verification, logout)
clientRouter.post("/edit-detail", verification, edit_details)
clientRouter.delete("/delete", verification, clientDelete)
clientRouter.put("/password-reset", verification, resetPassword)
clientRouter.put("/password-change", verification, changePassword)

module.exports = clientRouter;
