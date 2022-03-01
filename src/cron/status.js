// Importing files and pacakges necessary
import cron from 'cron';
import {checkStatus, getServices} from '../helpers/provider.js'
import Order from '../models/orderModel.js'
import Service from '../models/serviceModel.js'

const CronJob = cron.CronJob;

// Cron job function that runs every 20mins to fetch the status of Pending/Inprogress/Processing orders to update it in the database
export const checkBulkStatus = new CronJob('*/20 * * * *', async function() {
    // Console.log for when the cron task runs
    console.log("Running Cron Task: Checking Order Status'")
    // Fetching orders that are not compeleted, canceled or marked as refunded by the provider
    const orders = await Order.find({ $and: [{status: {$ne: "Completed"}}, {status: {$ne: "Canceled"}}, {status: {$ne: "Refunded"}}]});
    // Runs a loop for each order found in orders to fetch the status via  function then save the status
    for (const order of orders) {
        // Fetchs the status from the api via a function
        const status = await checkStatus(order.apiOrderId);
        // Finds the specific order in the database
        const findOrder = await Order.findOne({apiOrderId: order.apiOrderId})
        // Saves all the information to the constant findOrder
        findOrder.cost = status.charge
        findOrder.startCount = status.start_count,
        findOrder.status = status.status,
        findOrder.remains = status.remains
        // Waits till the order is saved before moving on
        await findOrder.save();
    }
}, null, true, process.env.TIME_ZONE);


// Function to sync services with the api that runs every 30mins 
export const updatingServiceActive = new CronJob('*/30 * * * *', async function() {
    // Console.log for when the cron task runs
    console.log("Running Cron Task: Disabling Inactive Services & Enabling active ones");
    // Finds all the services in the database
    const services = await Service.find();
    // Grabs all the services avaliable on providers website (all gets active ones)
    const providerServices = await getServices();
    // For loop to check each service that is in services constant (grabed from db)
    for (let i = 0; i < services.length; i++) {
        // Uses .filter() method to find if the service that is currently in the loop is on the providerServices page (if it is not then the length will be 0, if it is then the length will be 1)
        let data = providerServices.filter(data => data.service == services[i].supplierServiceId);
        // If data's length is 1 (meaning the provider has the service still lised ont their webstite) and if the service is disabled in the database to enable it
        if (data == 1 && services[i].isActive == false) {
            // Find the service in the db
            const queryService = await Service.findOne({supplierServiceId: services[i].supplierServiceId});
            // Update it's status to true
            queryService.isActive = true;
            // Save it to the database and wait till its saved before moving to the next one
            await queryService.save();
            // If the service is not on the providers website (length 0 in data) and it is marked as enabled in the db 
        } else if (data.length == 0 && services[i].isActive == true) {
            // Find the service in the db 
            const queryService = await Service.findOne({supplierServiceId: services[i].supplierServiceId});
            // Update its status to false
            queryService.isActive = false;
            // Save it to the database and wait till its saved before moving to the next one
            await queryService.save();
        }
    }
}, null, true, process.env.TIME_ZONE)



checkBulkStatus.start();
updatingServiceActive.start()




