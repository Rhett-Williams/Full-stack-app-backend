// Import mongoose to make a schema for mongodb
import mongoose from 'mongoose'


// Schema for orders
const orderSchema = mongoose.Schema({
    orderId: {
        type: Number,
        required: true
    },
    apiOrderId: {
        type: Number,
        required: true
    },
    serviceId: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    startCount: {
        type: Number,
        required: false,
        defualt: "null"
    },
    remains: {
        type: Number,
        required: true,
        defualt: "null"
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    paymentId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


// Defining Model with mongoose with the schema we created
const Order = mongoose.model("Orders", orderSchema);



// Exporting Order
export default Order;