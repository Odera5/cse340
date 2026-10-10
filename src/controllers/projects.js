// Import any needed model functions
import {
  getAllProjects,
  createProject,
  getUpcomingProjects,
  getProjectDetails,
  updateProject,
  getProjectCategoryIds,
  updateProjectCategories,
} from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";
import {
  getAllCategories,
} from "../models/categories.js";
// Validation rules for new projects

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Please provide a valid date"),

  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt({ min: 1 })
    .withMessage("Please select a valid organization"),
];

// Define any controller functions

const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = "Service Projects";

  res.render("projects", { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;
  const projectDetails = await getProjectDetails(projectId);
  const title = "Project Details";
  res.render("project", { title, projectDetails });
};

const showNewProjectForm = async (req, res) => {
  const title = "Add New Service Project";
  const organizations = await getAllOrganizations();
  res.render("new-project", { organizations, title });
};

const processNewProjectForm = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/new-project");
  }

  const { title, description, location, date, organizationId } = req.body;

  try {
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "Project created successfully!");
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    req.flash("error", "Failed to create project.");
    res.redirect("/new-project");
  }
};

const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const projectDetails = await getProjectDetails(projectId);
  const organizations = await getAllOrganizations();
  const title = "Edit Service Project";
  res.render("edit-project", {
    title,
    projectDetails: projectDetails[0],
    organizations,
  });
};

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(`/edit-project/${projectId}`);
  }

  const { title, description, location, date, organizationId } = req.body;

  try {
    await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "Project updated successfully!");
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating project:", error);
    req.flash("error", "Failed to update project.");
    return res.redirect(`/edit-project/${projectId}`);
  }
};


const showAssignCategoriesForm = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId < 1) {
    req.flash("error", "Invalid project ID.");
    return res.redirect("/projects");
  }

  try {
    const projectDetails = await getProjectDetails(projectId);

    if (projectDetails.length === 0) {
      req.flash("error", "Project not found.");
      return res.redirect("/projects");
    }

    const categories = await getAllCategories();
    const assignedCategoryIds = await getProjectCategoryIds(projectId);

    res.render("assign-categories", {
      title: "Assign Categories",
      project: projectDetails[0],
      categories,
      assignedCategoryIds,
    });
  } catch (error) {
    console.error("Error loading category assignments:", error);
    req.flash("error", "Unable to load project categories.");
    return res.redirect(`/project/${projectId}`);
  }
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId < 1) {
    req.flash("error", "Invalid project ID.");
    return res.redirect("/projects");
  }

  try {
    const projectDetails = await getProjectDetails(projectId);

    if (projectDetails.length === 0) {
      req.flash("error", "Project not found.");
      return res.redirect("/projects");
    }

    let categoryIds = req.body.categoryIds ?? [];

    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }

    categoryIds = categoryIds.map(Number);

    if (
      categoryIds.some((id) => !Number.isInteger(id) || id < 1) ||
      new Set(categoryIds).size !== categoryIds.length
    ) {
      req.flash("error", "One or more selected categories are invalid.");
      return res.redirect(`/project/${projectId}/categories`);
    }

    const categories = await getAllCategories();
    const validCategoryIds = new Set(
      categories.map((category) => Number(category.category_id)),
    );

    if (categoryIds.some((id) => !validCategoryIds.has(id))) {
      req.flash("error", "One or more selected categories do not exist.");
      return res.redirect(`/project/${projectId}/categories`);
    }

    await updateProjectCategories(projectId, categoryIds);

    req.flash("success", "Project categories updated successfully!");
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating project categories:", error);
    req.flash("error", "Failed to update project categories.");
    return res.redirect(`/project/${projectId}/categories`);
  }
};


// Export any controller functions
export {
  showProjectsPage,
  showProjectDetailsPage,
  processNewProjectForm,
  showNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
