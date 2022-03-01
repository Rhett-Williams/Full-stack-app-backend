// Importing packages and files
import express from "express";
import protect from '../middlewares/authMiddleware.js'; // This import is being used by passport.authenticate method
import passport from 'passport'
import  { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";

// Sets router as constant to use for routes
const router = express.Router();


// Sets routes and then passes each route to its controller respectively
router.route('/all/:showAll?').get(getCategories);
router.route('/create').post(passport.authenticate('jwt', {session: false}), createCategory);
router.route('/delete').post(passport.authenticate('jwt', {session: false}), deleteCategory);
router.route('/update').post(passport.authenticate('jwt', {session: false}), updateCategory);



// Exports router so it can be mentioned in index.js
export default router;








