// Import mongoose to make a schema for mongodb
import mongoose from 'mongoose';

// Import bcrypt to encrypt passwords before saving passwords to db and also comparing them while logging in
import bcrypt from 'bcryptjs'


// Schema for users
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email :{
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);


// Running before saving to encrypt the password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// To compare the password saved in db and the one passed into the function
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


// Defining Model with mongoose with the schema we created
const User = mongoose.model('User', userSchema);



// Exporting User
export default User;
