// Importing packages and files
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import Service from '../models/serviceModel.js';


// Services controller function to get all categories for admins
const adminServices = asyncHandler(async (req, res) => {
    let allServices;
    const showDisabled = (req.params.showDisabled === "true") ? true : false;

    if (showDisabled || !showDisabled) {
        allServices = await Service.find();
    } else {
        allServices = await Service.find({isActive: true});
    }

    if (allServices) {
        return res.status(201).json({
            showDisabled,
            services: allServices
        });
    } else {
        res.status(400);
        throw new Error("Could not fetch services");
    }
});


// Services controller function to get all categories for users
const publicServices = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    const services = await Service.find();
    
    let sendServices = []
    services.forEach(service => {
        let category = categories.filter(c => c._id.valueOf() === service.categoryId)
        let data = {
            "serviceId": service._id,
            "name": service.name,
            "type": service.serviceType,
            "rate": service.retailPrice,
            "quantity": service.quantity,
            "refill": true,
            "category": category[0].name
        }
       sendServices.push(data) 
    })

    return res.status(200).json({services: sendServices});
})


// Services controller function for creating services
const createService = asyncHandler(async (req, res) => {
    const {categoryId, supplierServiceId, name, serviceType, retailPrice, quantity, quality, denyLinkDuplicates} = req.body;
    const category = await Category.findById(categoryId);

    if (category) {
        const newService = await Service.create({
            categoryId,
            supplierServiceId,
            name,
            serviceType,
            retailPrice,
            quantity,
            quality,
            denyLinkDuplicates
        });
    
        if (newService) {
            return res.status(201).json({
                newService
            })
        } else {
            res.status(400);
            throw new Error("Could not save to database");
        }
    } else {
        res.status(201);
        throw new Error('Not valiad categoryId provided');
    }
});


// Services controller function for deleting services
const deleteService = asyncHandler(async (req, res) => {
    const { serviceId } = req.body;

    if (!serviceId) {
        res.status(400);
        throw new Error("serviceId is not provided");
    }

    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (deletedService) {
        res.status(201).json({
            serviceId: deletedService._id,
            message: "Successfully deleted"
        });
    } else {
        res.status(400);
        throw new Error("Could not find service or could not be deleted");
    }
});


// Services controller function for updating services
const updateService = asyncHandler(async (req, res) => {
    const {serviceId, categoryId, supplierServiceId, name, serviceType, retailPrice, quantity, quality, denyLinkDuplicates, isActive} = req.body;
    const service = await Service.findById(serviceId);

    if (!serviceId) {
        res.status(400);
        throw new Error('No serviceId provided');
    }

    if (!service) {
        res.status(400);
        throw new Error('Service not found');
    }

    if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
            res.status(201);
            throw new Error('Not valiad categoryId provided');
        }
    }
    
    if (categoryId) service.categoryId = categoryId;
    if (isActive) service.isActive = isActive;
    if (supplierServiceId) service.supplierServiceId = supplierServiceId;
    if (name) service.name = name;
    if (serviceType) service.serviceType = serviceType;
    if (retailPrice) service.retailPrice = retailPrice;
    if (quantity) service.quantity = quantity;
    if (quality) service.quality = quality;
    if (denyLinkDuplicates) service.denyLinkDuplicates = denyLinkDuplicates;

    const updatedService = await service.save();

    if  (!updatedService) {
        res.status(400);
        throw new Error("Could not update to database");
    }

    return res.status(201).json({
        updatedService,
        message: "Service updated"
    });
});



// Exporting functions
export  {publicServices, adminServices, createService, updateService,  deleteService};