// transactionHelper.js
const mongoose = require('mongoose');

// Yeh function transaction ko handle karega
async function executeTransaction(callback) {
    const session = await mongoose.startSession(); // Mongoose session start karna
    session.startTransaction(); // Transaction ko start karte hain

    try {
        // Callback function ko pass karte hain, jisme user-specific logic hoga
        const result = await callback(session);

        // Agar sab kuch theek ho, toh transaction ko commit karenge
        await session.commitTransaction();
        
        return { success: true, data: result }; // Success ka result return karenge
    } catch (error) {
        // Agar error aaye, toh transaction ko rollback karenge
        await session.abortTransaction();

        return { success: false, error: error.message || error }; // Error ka result return karenge
    } finally {
        // Session ko close karenge
        session.endSession();
    }
}

module.exports = { executeTransaction };
        