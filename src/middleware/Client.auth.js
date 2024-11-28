const jwt = require('jsonwebtoken');
const Client = require('../Models/Client.model');


const privateKey = 'nopqrstuvwxyzabcdefghijklm';


const verification = async (req, res, next) => {
    try {
        const token2 = req.headers.authorization;
        const token = token2.split(" ")[1];

        const decoded = jwt.verify(token, privateKey);

        const client = await Client.findOne({ email: decoded.email });
        if (!client) {
            return res.send({ message: "Client allowed to access" });
        }
        next();


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = verification;
