
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

import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

// Home route
router.get("/", showHomePage);

// Organization routes
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

router.get("/new-organization", showNewOrganizationForm);
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);

router.get("/edit-organization/:id", showEditOrganizationForm);
router.post(
  "/edit-organization/:id",
  organizationValidation,
  processEditOrganizationForm,
);

// Project routes
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);

router.get("/new-project", showNewProjectForm);
router.post(
  "/new-project",
  projectValidation,
  processNewProjectForm,
);

router.get("/edit-project/:id", showEditProjectForm);
router.post(
  "/edit-project/:id",
  projectValidation,
  processEditProjectForm,
);

// Project category-assignment routes
router.get(
  "/project/:id/categories",
  showAssignCategoriesForm,
);

router.post(
  "/project/:id/categories",
  processAssignCategoriesForm,
);

// Category routes
router.get("/categories", showCategoriesPage);
router.get("/categories/:id", showCategoryDetailsPage);

router.get("/new-category", showNewCategoryForm);
router.post(
  "/new-category",
  categoryValidation,
  processNewCategoryForm,
);

router.get("/edit-category/:id", showEditCategoryForm);
router.post(
  "/edit-category/:id",
  categoryValidation,
  processEditCategoryForm,
);

// Error testing route
router.get("/test-error", testErrorPage);

export default router;
