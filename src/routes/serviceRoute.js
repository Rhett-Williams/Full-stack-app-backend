// Importing packages and file
import express from "express";
import protect from '../middlewares/authMiddleware.js'; // This import is being used by passport.authenticate method
import passport from 'passport'
import  { adminServices, createService, deleteService, publicServices, updateService, } from "../controllers/serviceController.js";

// Sets router as constant to use for routes
const router = express.Router();


// Sets routes and then passes each route to its controller respectively
router.route('/admin/create').post(passport.authenticate('jwt', {session: false}), createService);
router.route('/admin/delete').post(passport.authenticate('jwt', {session: false}), deleteService);
router.route('/admin/update').post(passport.authenticate('jwt', {session: false}), updateService);
router.route('/admin/:showDisabled?').get(passport.authenticate('jwt', {session: false}), adminServices);
router.route('/public').get(publicServices);



// Exports router so it can be mentioned in index.js
export default router;

