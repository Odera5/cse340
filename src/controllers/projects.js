// Import any needed model functions
import {
  getAllProjects,
  createProject,
  getUpcomingProjects,
  getProjectDetails,
  updateProject,
} from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";

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
    .withMessage("Description must be less than 1000 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location must be less than 200 characters"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date format"),

  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
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
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    req.flash("error", "Failed to update project.");
    res.redirect(`/edit-project/${projectId}`);
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
};
