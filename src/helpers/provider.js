// Import fetch to send api requests
import fetch from 'node-fetch'


// Grab data from .emv so all functions can use it (url to send the request to and the api key)
const providerEndpoint = `https://${process.env.PROVIDER_ENDPOINT}/api/v2`
const providerKey = process.env.PROVIDER_APIKEY


// function to place the order with the provider
export async function sendOrderProvider(orderData) {
    try {
        // Using order data to get params to make a valid request
        const params = {
            key: providerKey,
            action: "add",
            service: orderData.service,
            link: orderData.link,
            quantity: orderData.quantity
        }
        
        // Basic options for fetch request
        const options = {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify( params )
        }

        // Placing fetch request to provider end point with params const and options const
        const placeOrder = await fetch(providerEndpoint, options);

        // Turn placeOrder response to json and save it save response const
        const response = await placeOrder.json();
        
        // take the order id from the response we got from placing the order then checking its status to grab the rest of detatils to return 
        let orderStatus = await checkStatus(response.order);

        // Make a final response const with combing the data of placing the order and checking it status
        let finalResponse = {
            order: response.order,
            charge: orderStatus.charge,
            startCount: orderStatus.start_count,
            orderStatus: orderStatus.status,
            orderRemains: orderStatus.remains
        }

        // return the final response const
        return finalResponse;

        // Catch error and console.error
    } catch (err) {
        console.error(err);
    }
    
}

// Function to send an api requets to the provider to get a status update on the order
export async function checkStatus(exteneralId) {
    try {
        // Make params const from the info passed into the function
        const params = {
            key: providerKey,
            action: "status",
            order: exteneralId
        }

        // Basic options for fetch request
        const options = {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify( params )
        }

        // Sending a fetch request using params and options const to check the stauts
        const checkStatus = await fetch(providerEndpoint, options);
        
        // Changing the response from checkStatus .json() and saving it to response const
        const response = await checkStatus.json();

        // Returning its response
        return response;

        // Catch error and console.error
    } catch (err) {
        console.error(err.message);
    }
}


// function to fetch active services from provider
export async function getServices() {
    try {
        // Sending GET request and saving it as request const
        const request = await fetch(`${providerEndpoint}?key=${providerKey}&action=services`);

        // Changing response from request to json() and saving to services const
        const services = await request.json();

        // Return services
        return services;
        
        // Catch error and console.error
    } catch (err) {
        console.error(err.message)
    }
}