import bcrypt from "bcrypt";

import {
  createUser,
  findUserByEmail,
  authenticateUser,
  getAllUsers,
} from "../models/users.js";

import { getVolunteerProjectsByUserId } from "../models/projects.js";

// Display the registration form.
const showUserRegistrationForm = (req, res) => {
  res.render("register", {
    title: "Register",
  });
};

// Process registration and hash the password before saving it.
const processUserRegistrationForm = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (!name?.trim() || !email?.trim() || !password) {
      req.flash("error", "Please complete all required fields.");
      return res.redirect("/register");
    }

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("/register");
    }

    if (password.length < 7) {
      req.flash("error", "Password must be at least 7 characters.");
      return res.redirect("/register");
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      req.flash("error", "An account with that email already exists.");
      return res.redirect("/register");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await createUser(name, email, passwordHash);

    req.flash("success", "Registration successful. Please log in.");
    return res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Registration failed. Please try again.");
    return res.redirect("/register");
  }
};

// Display the login form.
const showLoginForm = (req, res) => {
  res.render("login", {
    title: "Login",
  });
};

// Authenticate the user and establish a session.
const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email?.trim() || !password) {
      req.flash("error", "Enter your email and password.");
      return res.redirect("/login");
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    // Regenerate the session to help prevent session fixation.
    req.session.regenerate((error) => {
      if (error) {
        console.error("Session regeneration error:", error);
        return res.status(500).send("Unable to log in. Please try again.");
      }

      req.session.user = user;

      req.session.save((saveError) => {
        if (saveError) {
          console.error("Session save error:", saveError);
          return res.status(500).send("Unable to save your session.");
        }

        return res.redirect("/dashboard");
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Unable to log in. Please try again.");
    return res.redirect("/login");
  }
};

// Log the user out and destroy their session.
const processLogout = (req, res, next) => {
  if (!req.session) {
    return res.redirect("/");
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
};

// Restrict a route to authenticated users.
const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    req.flash("error", "Please log in to access that page.");
    return res.redirect("/login");
  }

  return next();
};

// Restrict a route to users with a specific role.
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.session?.user) {
      req.flash("error", "Please log in first.");
      return res.redirect("/login");
    }

    if (req.session.user.role_name !== requiredRole) {
      req.flash("error", "You are not authorized to access that page.");
      return res.redirect("/");
    }

    return next();
  };
};

// Display the authenticated user's dashboard and volunteer projects.
const showDashboard = async (req, res, next) => {
  try {
    const volunteerProjects = await getVolunteerProjectsByUserId(
      req.session.user.user_id,
    );

    res.render("dashboard", {
      title: "Dashboard",
      user: req.session.user,
      volunteerProjects,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return next(error);
  }
};

// Display all registered users. The route must be admin-protected.
const showUsersPage = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.render("users", {
      title: "Registered Users",
      users,
    });
  } catch (error) {
    console.error("Error loading users:", error);
    return next(error);
  }
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsersPage,
};
