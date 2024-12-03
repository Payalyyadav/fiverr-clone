const mongoose = require('mongoose');

async function executeTransaction(callback) {
    const session = await mongoose.startSession(); 
    session.startTransaction();

    try {
       
        const result = await callback(session);

      
        await session.commitTransaction();
        
        return { success: true, data: result }; 
    } catch (error) {
      
        await session.abortTransaction();

        return { success: false, error: error.message || error }; 
    } finally {
        
        session.endSession();
    }
}

module.exports = { executeTransaction };
        