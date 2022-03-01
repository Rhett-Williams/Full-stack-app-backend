// Import mongoose to make a schema for mongodb
import mongoose from 'mongoose';


// Schema for payment logs
const paymentSchema = mongoose.Schema({
    paymentMethod: {
        type: String,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    memo: {
        type: String,
        required: true
    },
    transcationDetails: { 
        type: Object,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    }
}, {
    timestamps: true
});


// Defining Model with mongoose with the schema we created
const Payment =  mongoose.model('Payment', paymentSchema);


// Exporting Payment
export default Payment;