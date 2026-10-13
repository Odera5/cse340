import express from "express";

import { showHomePage } from "./controllers/index.js";

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";

import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  processVolunteerSignup,
  processVolunteerCancellation,
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
} from "./controllers/categories.js";

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsersPage,
} from "./controllers/users.js";

import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

// ==========================================
// Authentication routes
// ==========================================

// Registration
router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

// Login and logout
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

// Dashboard: logged-in users only
router.get("/dashboard", requireLogin, showDashboard);

// Users list: administrators only
router.get("/users", requireRole("admin"), showUsersPage);

// ==========================================
// Home route
// ==========================================

router.get("/", showHomePage);

// ==========================================
// Organization routes
// ==========================================

// Public organization listing and details
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

// Create organization: administrators only
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);

router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm,
);

// Edit organization: administrators only
router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm,
);

router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);

// ==========================================
// Project routes
// ==========================================

// Public project listing and details
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);

// Create project: administrators only
router.get("/new-project", requireRole("admin"), showNewProjectForm);

router.post(
  "/new-project",
  requireRole("admin"),
  projectValidation,
  processNewProjectForm,
);

// Edit project: administrators only
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);

router.post(
  "/edit-project/:id",
  requireRole("admin"),
  projectValidation,
  processEditProjectForm,
);

// Assign categories to a project: administrators only
router.get(
  "/project/:id/categories",
  requireRole("admin"),
  showAssignCategoriesForm,
);

router.post(
  "/project/:id/categories",
  requireRole("admin"),
  processAssignCategoriesForm,
);

// ==========================================
// Category routes
// ==========================================

// Public category listing and details
router.get("/categories", showCategoriesPage);
router.get("/categories/:id", showCategoryDetailsPage);

// Create category: administrators only
router.get("/new-category", requireRole("admin"), showNewCategoryForm);

router.post(
  "/new-category",
  requireRole("admin"),
  categoryValidation,
  processNewCategoryForm,
);

router.post("/project/:id/volunteer", requireLogin, processVolunteerSignup);

router.post(
  "/project/:id/cancel-volunteer",
  requireLogin,
  processVolunteerCancellation,
);

// Edit category: administrators only
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);

router.post(
  "/edit-category/:id",
  requireRole("admin"),
  categoryValidation,
  processEditCategoryForm,
);

// ==========================================
// Error testing route
// ==========================================

router.get("/test-error", testErrorPage);

export default router;
