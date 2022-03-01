// Imports jsonwebtoken package to encrypt and sign a JWT token based on users ID for auth purposes
import jwt from 'jsonwebtoken';


// Function that takes in users Id then signs it using jwt
const generateToken = (userId) => {
    // The token secret and expiriesIn is grabbed from .env 
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    });
    // Returns the signed token once generated
    return token;
}


// Exports the function
export default generateToken