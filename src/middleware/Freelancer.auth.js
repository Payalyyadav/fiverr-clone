const jwt = require('jsonwebtoken');
const Freelancer = require('../Models/Freelancer.model');


const privateKey = 'abcdeuvwxyzfghijklmnopqrst';


const verification = async (req, res, next) => {
    try {
        const token2 = req.headers.authorization;
        const token = token2.split(" ")[1];

        const decoded = jwt.verify(token, privateKey);

        const freelancer = await Freelancer.findOne({ email: decoded.email });
        if (!freelancer) {
            return res.send({ message: "Freelancer allowed to access" });
        }
        next();


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = verification;
