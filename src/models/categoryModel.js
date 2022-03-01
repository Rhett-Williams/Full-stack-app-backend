// Import mongoose to make a schema for mongodb
import mongoose from "mongoose";


// Schema for categories
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// Defining Model with mongoose with the schema we created
const Category = mongoose.model('Category', categorySchema);



// Exporting Category
export default Category;

