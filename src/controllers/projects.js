// Import any needed model functions
import {
  getAllProjects,
  createProject,
  getUpcomingProjects,
  getProjectDetails,
  updateProject,
  getProjectCategoryIds,
  updateProjectCategories,
  addVolunteer,
  removeVolunteer,
  getVolunteerProjectsByUserId,
} from "../models/projects.js";

import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";
import { getAllCategories } from "../models/categories.js";

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

// Display all service projects
const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = "Service Projects";

  res.render("projects", { title, projects });
};

// Display details for one project
const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId < 1) {
      req.flash("error", "Invalid project ID.");
      return res.redirect("/projects");
    }

    const projectDetails = await getProjectDetails(projectId);

    if (projectDetails.length === 0) {
      req.flash("error", "Project not found.");
      return res.redirect("/projects");
    }

    let isVolunteer = false;

    if (req.session?.user) {
      const volunteerProjects = await getVolunteerProjectsByUserId(
        req.session.user.user_id,
      );

      isVolunteer = volunteerProjects.some(
        (project) => Number(project.project_id) === projectId,
      );
    }

    res.render("project", {
      title: "Project Details",
      projectDetails,
      isVolunteer,
      user: req.session?.user || null,
    });
  } catch (error) {
    console.error("Error loading project details:", error);
    return next(error);
  }
};

// Sign up the logged-in user to volunteer for a project
const processVolunteerSignup = async (req, res, next) => {
  const projectId = Number(req.params.id);
  const userId = req.session.user.user_id;

  try {
    if (!Number.isInteger(projectId) || projectId < 1) {
      req.flash("error", "Invalid project ID.");
      return res.redirect("/projects");
    }

    const projectDetails = await getProjectDetails(projectId);

    if (projectDetails.length === 0) {
      req.flash("error", "Project not found.");
      return res.redirect("/projects");
    }

    const added = await addVolunteer(userId, projectId);

    if (added) {
      req.flash("success", "You have successfully signed up to volunteer!");
    } else {
      req.flash("error", "You have already signed up for this project.");
    }

    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Volunteer signup error:", error);
    return next(error);
  }
};

// Cancel the logged-in user's volunteer signup
const processVolunteerCancellation = async (req, res, next) => {
  const projectId = Number(req.params.id);
  const userId = req.session.user.user_id;

  try {
    if (!Number.isInteger(projectId) || projectId < 1) {
      req.flash("error", "Invalid project ID.");
      return res.redirect("/projects");
    }

    const projectDetails = await getProjectDetails(projectId);

    if (projectDetails.length === 0) {
      req.flash("error", "Project not found.");
      return res.redirect("/projects");
    }

    const removed = await removeVolunteer(userId, projectId);

    if (removed) {
      req.flash("success", "Your volunteer signup has been cancelled.");
    } else {
      req.flash("error", "You were not signed up for this project.");
    }

    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Volunteer cancellation error:", error);
    return next(error);
  }
};

// Display the form for creating a project
const showNewProjectForm = async (req, res) => {
  const title = "Add New Service Project";
  const organizations = await getAllOrganizations();

  res.render("new-project", { organizations, title });
};

// Process the new project form
const processNewProjectForm = async (req, res) => {
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
    return res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error("Error creating project:", error);
    req.flash("error", "Failed to create project.");
    return res.redirect("/new-project");
  }
};

// Display the form for editing a project
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

// Process the edit project form
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

// Display the form for assigning categories to a project
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

// Process category assignments
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

// Export controller functions
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
  processVolunteerSignup,
  processVolunteerCancellation,
};
