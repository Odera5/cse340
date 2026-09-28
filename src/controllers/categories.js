import {
  getAllCategories,
  getCategoryDetails,
  getCategoryById,
  createCategory,
  updateCategory,
} from "../models/categories.js";

import { body, validationResult } from "express-validator";

// Validation rules for category forms
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters"),
];

// Show all categories
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();

  const title = "Service Categories";

  res.render("categories", {
    title,
    categories,
  });
};

// Show one category's details
const showCategoryDetailsPage = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryDetails(categoryId);
  const title = "Category Details";
  res.render("category", { title, categoryDetails });
};
// Show the new category form
const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";

  res.render("new-category", {
    title,
  });
};

// Process the new category form
const processNewCategoryForm = async (req, res) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/new-category");
  }

  const { name } = req.body;

  try {
    const categoryId = await createCategory(name);

    req.flash("success", "Category added successfully!");

    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    req.flash("error", "Failed to create category.");

    res.redirect("/new-category");
  }
};

// Show the edit category form
const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;

  const categoryDetails = await getCategoryById(categoryId);

  const title = "Edit Category";

  res.render("edit-category", {
    title,
    categoryDetails: categoryDetails[0],
  });
};

// Process the edit category form
const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;

  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(`/edit-category/${categoryId}`);
  }

  const { name } = req.body;

  try {
    await updateCategory(categoryId, name);

    req.flash("success", "Category updated successfully!");

    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    req.flash("error", "Failed to update category.");

    res.redirect(`/edit-category/${categoryId}`);
  }
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
};
