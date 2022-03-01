// Import packages and files
import passport from 'passport'
import passportJwt from 'passport-jwt'
import User from '../models/userModel.js'


// Define variables
const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt;

// Grab secret key and token sent in headers of the reequest
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET


// Function to see if the token is valid and if it is then return the user on otherwise return "Unauthorised" in response to the api request
const protect = passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    const user = User.findOne({_id: jwt_payload.userId}, function(err, user) {
        if (err) return done(err, false);
        if (user) {
            return done(null, user)
        } else {
            return done(null, false);
        }
    }).select("-password");
}));



// Export function so it can be used in routes where protection is required
export default protect;