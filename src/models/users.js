
import db from "./db.js";
import bcrypt from "bcrypt";

// Create a new user with the default user role.
const createUser = async (name, email, passwordHash) => {
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts.shift();
  const lastName = nameParts.join(" ") || firstName;

  const query = `
    INSERT INTO users (
      first_name,
      last_name,
      email,
      password,
      role_id
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      (SELECT role_id FROM roles WHERE role_name = 'user')
    )
    RETURNING user_id
  `;

  const result = await db.query(query, [
    firstName,
    lastName,
    email.trim().toLowerCase(),
    passwordHash,
  ]);

  if (result.rows.length === 0) {
    throw new Error("Failed to create user.");
  }

  return result.rows[0].user_id;
};

// Find a user by email, including their role and hashed password.
const findUserByEmail = async (email) => {
  const query = `
    SELECT
      u.user_id,
      u.first_name || ' ' || u.last_name AS name,
      u.email,
      u.password AS password_hash,
      r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE LOWER(u.email) = LOWER($1)
  `;

  const result = await db.query(query, [
    email.trim().toLowerCase(),
  ]);

  return result.rows[0] || null;
};

// Verify the submitted password against the stored bcrypt hash.
const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash,
  );

  if (!passwordMatches) {
    return null;
  }

  // Never include the password hash in the session user object.
  const { password_hash, ...authenticatedUser } = user;

  return authenticatedUser;
};

// Retrieve all registered users and their roles for the admin page.
const getAllUsers = async () => {
  const query = `
    SELECT
      u.user_id,
      u.first_name || ' ' || u.last_name AS name,
      u.email,
      r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    ORDER BY u.user_id
  `;

  const result = await db.query(query);

  return result.rows;
};

export {
  createUser,
  findUserByEmail,
  authenticateUser,
  getAllUsers,
};
