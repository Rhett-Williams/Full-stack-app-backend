// Importing packages and files
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/jwt/generateToken.js';


// Function for registering users
const registerUser = asyncHandler (async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const newUser = await User.create({
        name,
        email,
        password
    });

    if (newUser) {
        return res.status(201).json({
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id),
            message: "Successfully registered"
        });
    } else {
        res.status(400);
        throw new Error("Could not save to database");
    }
});


// Functiont to log users in
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});

    if (user && await user.matchPassword(password)) {
        res.status(201).json({
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            message: "Successfully authenticated"
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }

});


// function to get profile information about the user that is logged in
const userData = asyncHandler(async (req, res) => {
    return res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin
    });
});


// Services controller function for updating user profile
const updateProfie = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.email) user.email = req.body.email
        if (req.body.name) user.name = req.body.name
        if (req.body.password) user.password = req.body.password

        const updatedUser = await user.save();

        if (updatedUser) {
            return res.status(201).json({
                name: updatedUser.name,
                email: updatedUser.email,
                token: generateToken(updatedUser._id),
                message: "Profile updated"
            }) 
        } else {
            res.status(400)
            throw new Error("Could not save to database") 
        }

    } else {
        res.status(404)
        throw new Error("User not found")
    }
})



// Exporting functions
export {registerUser, loginUser, userData, updateProfie};