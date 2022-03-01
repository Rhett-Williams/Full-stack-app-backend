// Importing packages and files
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'


// function for creating an order (not avaliable via routes - internal method)
export const createOrder = asyncHandler(async (orderData) => {
    const amountOfOrders = await Order.countDocuments()

    const newOrder = await Order.create({
        orderId: amountOfOrders + 1,
        apiOrderId: orderData.apiOrderId,
        serviceId: orderData.serviceId,
        link: orderData.link,
        cost: orderData.cost,
        startCount: orderData.startCount,
        remains: orderData.remains,
        status: orderData.status,
        paymentId: orderData.paymentId
    });

    if (!newOrder) throw new Error("Order data could not be saved")
    return {
        newOrder
    }
});


// Order controller for getting all orders stored in db
export const getOrders = asyncHandler(async (req, res) => {
    const allOrders = await Order.find().select('-_id');

    if (!allOrders) {
        res.status(401);
        throw new Error("Orders could not be fetched");
    }

    res.status(200).json({
        orders: allOrders
    })
})