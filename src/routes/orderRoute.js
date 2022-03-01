// Importing packages and file
import express from 'express';
import protect from '../middlewares/authMiddleware.js'; // This import is being used by passport.authenticate method
import passport from 'passport'
import {getOrders} from '../controllers/orderController.js'

// Sets router as constant to use for routes
const router = express.Router();


// Sets routes and then passes each route to its controller respectively
router.route('/all').get(passport.authenticate('jwt', {session: false}), getOrders);



// Exports router so it can be mentioned in index.js
export default router;