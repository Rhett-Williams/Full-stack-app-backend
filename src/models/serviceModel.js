// Import mongoose to make a schema for mongodb
import mongoose from 'mongoose'


// Schema for services
const serviceSchema = mongoose.Schema({
    categoryId: {
        type: Object,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    supplierServiceId: {
        type: Number,
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    retailPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    quality: {
        type: String,
        required: true
    },
    denyLinkDuplicates: {
        type: Boolean,
        required: true,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
},
{
    timestamps: true
})


// Defining Model with mongoose with the schema we created
const Service = mongoose.model("Services", serviceSchema);



// Exporting Service
export default Service