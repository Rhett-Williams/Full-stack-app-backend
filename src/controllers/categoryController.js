// Importing packages and files
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';


// Category controller function for getting to all categories
const getCategories = asyncHandler(async (req, res) => {
    let allCategories;
    const showAll = (req.params.showAll === "true") ? true : false;
    
    if (showAll) {
        allCategories = await Category.find();
    } else {
        allCategories = await Category.find({isDisabled: false});
    }
    
    if (allCategories) {
        return res.status(201).json({
            showAll,
            categories: allCategories
        });
    } else {
        res.status(400);
        throw new Error("Could not fetch categories");
    }
});


// Category controller function for creating categories
const createCategory = asyncHandler(async (req, res) => {
    const {name, isDisabled} = req.body;

    const newCategory = await Category.create({
        name,
        isDisabled
    })

    if (newCategory) {
        return res.status(201).json({
            id: newCategory._id,
            name: newCategory.name,
            isDisabled: newCategory.isDisabled
        })
    } else {
        res.status(400)
        throw new Error('Could not save to database')
    }
});


// Category controller function for deleting a service
const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.body;

    if (categoryId) {
        const deletedCategory = await Category.deleteOne({"_id": categoryId});

        if (deletedCategory.deletedCount === 1) {
            res.status(201).json({
                categoryId,
                message: "Successfully deleted"
            });
        } else {
            res.status(400)
            throw new Error("Could not find or delete category");
        }

    } else {
        res.status(400);
        throw new Error("Category Id not provided");
    }   
});


// Category controller function for updating categories
const updateCategory = asyncHandler(async (req, res) => {
    if (req.body.categoryId) {
        const category = await Category.findById(req.body.categoryId);

        if (category) {
            if (req.body.name) category.name = req.body.name;
            if (req.body.isDisabled) category.isDisabled = req.body.isDisabled;

            const updatedCategory = await category.save();

            if (updatedCategory) {
                res.status(201).json({
                    id: updatedCategory._id,
                    name: updatedCategory.name,
                    isDisabled: updatedCategory.isDisabled,
                    message: "Category updated"
                });
            } else {
                res.status(400);
                throw new Error("Could not save to database") ;
            }

        } else {
            res.status(404);
            throw new Error("Category not found");
        }

    } else {
        res.status(400);
        throw new Error('No categoryId provided');
    }
});




// Exporting functions
export {getCategories, createCategory, deleteCategory,  updateCategory};