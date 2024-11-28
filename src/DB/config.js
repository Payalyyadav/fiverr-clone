const mongoose = require('mongoose');


function connectionMongoDB(URI) {

    return mongoose.connect(URI);

}

module.exports = connectionMongoDB;
