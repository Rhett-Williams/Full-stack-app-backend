// Imports neccessary packages and files
import express from 'express';
import passport from 'passport'
import protect from '../middlewares/authMiddleware.js'; // This import is being used by passport.authenticate method
import {registerUser, loginUser, userData, updateProfie} from '../controllers/userController.js'

// Sets router as constant to use for routes
const router = express.Router();


// Sets routes and then passes each route to its controller respectively
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(passport.authenticate('jwt', {session: false}), userData);
router.route('/updateprofile').post(passport.authenticate('jwt', {session: false}), updateProfie);



// Exports router so it can be mentioned in index.js
export default router