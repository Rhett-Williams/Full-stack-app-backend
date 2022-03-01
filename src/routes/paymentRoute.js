// Importing packages and file
import express from 'express';
import { createStripePayment, successStripePayment } from '../controllers/payments/stripe.js';
import {getPayments} from '../controllers/paymentController.js'
import protect from '../middlewares/authMiddleware.js'; // This import is being used by passport.authenticate method
import passport from 'passport'

// Sets router as constant to use for routes
const router = express.Router();


// Sets routes and then passes each route to its controller respectively
router.post('/stripe/create', createStripePayment);
router.get('/stripe/success/:sessionId', successStripePayment);
router.get('/all', passport.authenticate('jwt', {session: false}), getPayments);



// Exports router so it can be mentioned in index.js
export default router;