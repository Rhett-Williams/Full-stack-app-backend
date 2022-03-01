// Importing packages and files
import asyncHandler from 'express-async-handler'
import Stripe from 'stripe';
import Service from '../../models/serviceModel.js'
import Payment from '../../models/paymentModel.js'
import { sendOrderProvider } from '../../helpers/provider.js'
import {createOrder} from '../orderController.js'

// Importing stripe private key from .env and using it
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY)


// Function for getting data to create a stripe session then returning stripe session url
export const createStripePayment = asyncHandler(async (req, res) => {
        // Grabing stuff from the body of the request
        const {link, serviceId, customerEmail} = req.body

        // Error handling and finding the service by serviceId provided in request to make sure its valiad
        if (!serviceId) throw new Error('serviceId is required');
        const lineItem = await Service.findById(serviceId)
        if (!lineItem) throw new Error('Invalid serviceId provided');


        // Creating Stripe session
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    name: lineItem.name,
                    quantity: 1,
                    currency: 'usd',
                    amount: lineItem.retailPrice * 100,
                    description: link
                }
            ],
            metadata: {
                link, 
                serviceId,
                customerEmail
            },
            customer_email: customerEmail,
            success_url: `${process.env.CLIENT_URL}/stripe/success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        });


        // Returning stripe session url
        res.status(200).json({
            url: stripeSession.url
        });
 
});


// Function to start the order, save the payment and order information to the db after a success stripe session
export const successStripePayment = asyncHandler(async(req, res) => {
        // Grabing param from URL request
        const stripeToken = req.params.sessionId

        // Error handling and finding the session and service from the information given
        if (!stripeToken) throw new Error("Stripe token not provided")
        const session = await stripe.checkout.sessions.retrieve(stripeToken);
        const service = await Service.findById(session.metadata.serviceId)


        // If payment paid, send order to provider via a function and then save payment and orders then returning data
        if (session.payment_status === "paid") {
            
            const payment = await Payment.findOne({memo: session.id})
            if (payment) {
                return res.status(401).json({"message": "This order already exists"})
            }

            let orderData = {
                service: service.supplierServiceId,
                link: session.metadata.link,
                quantity: service.quantity
            }

            let providerOrder = await sendOrderProvider(orderData);
            
            const paymentLog = await Payment.create({
                paymentMethod: "stripe",
                amountPaid: session.amount_total / 100,
                fee: ((session.amount_total / 100) * 0.029) + 0.30,
                customerEmail: session.metadata.customerEmail,
                memo: session.id,
                transcationDetails: session,
                status: "Compeleted"
            });
        
            if (!paymentLog) throw new Error("Payment data could not be saved");

            orderData = {
                apiOrderId: providerOrder.order,
                serviceId: session.metadata.serviceId,
                link: session.metadata.link,
                cost: providerOrder.charge,
                startCount: providerOrder.startCount,
                remains: providerOrder.orderRemains,
                status: providerOrder.orderStatus,
                paymentId: paymentLog._id
            }
            
            const orderLog = await createOrder(orderData);

            if (!orderLog) throw new Error("Order data could not be saved");

            res.status(200).json({
                order: orderLog.newOrder.orderId,
                service: service.name,
                email: paymentLog.customerEmail,
                link: orderData.link,
                startCount: orderData.startCount,
                remains: orderData.remains,
                status: orderData.status
            });
            
            // If session id is unpaid then send a error message saying its an invalid payment
        } else if (session.payment_status === "unpaid") {
            res.status(401).json({
                message: "Invalid payment"
            });
            
            // If something goes wrong then sending the session and a message
        } else {
            res.status(401).json({
                message: "Something went wrong!",
                session
            });
        }    
});
 
