// Importing packages and files necessary
import express from 'express';
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js'
import categoryRoutes from './routes/categoryRoute.js'
import serviceRoutes from './routes/serviceRoute.js'
import paymentRoutes from './routes/paymentRoute.js'
import orderRoutes from './routes/orderRoute.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

// Cron Job files (imported here so they automatically run instead of running them seperatly to the index.js file)
import {checkBulkStatus, updatingServiceActive} from './cron/status.js'


// Set app is a variable to express() function so it can be used
const app = express();

// Sets the port of the App from .env file and if it cannot get the port from the .env then it sets it as 5000
const port = process.env.PORT || 5000;


// Runs the function to connect to database
connectDB();


// Middlewares to use
app.use(express.json());

// Using cors to allow any origin to make requets to the backend server (this)
app.use(cors({
    origin: '*'
}));


// A json get response on / to know the server is running
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Successfully up and running!"
    })
})

// Routes (the basic route then calls to its apporpriate file)
app.use('/api/admin', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/calculate', paymentRoutes);
app.use('/api/order', orderRoutes);


// Custom middleware for error handling and throwing errors
app.use(notFound);
app.use(errorHandler);



// Console.log a message with the port - once the application is running
app.listen(port, () => {
    console.log(`Server successfully running on port ${port}`)
});

