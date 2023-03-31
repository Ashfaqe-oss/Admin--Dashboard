import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId: String,
    cost: String,
    products: {
        type: [mongoose.Types.ObjectId], // an object type with an objectID
        of: Number,
    },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;