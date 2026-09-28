import db from "./db.js";

const getAllCategories = async () => {
  const query = `
    SELECT name, category_id
    FROM category;
  `;

  const result = await db.query(query);

  return result.rows;
};

// Get one category and its projects
const getCategoryDetails = async (categoryId) => {
  const query = `
    SELECT c.category_id, c.name, sp.project_id, sp.title
    FROM category c
    LEFT JOIN project_category cp
    ON c.category_id = cp.category_id
    LEFT JOIN service_project sp
    ON cp.project_id = sp.project_id
    WHERE c.category_id = $1;
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

// Get one category by ID
const getCategoryById = async (categoryId) => {
  const query = `
    SELECT category_id, name
    FROM category
    WHERE category_id = $1;
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

// Create a new category
const createCategory = async (name) => {
  const query = `
    INSERT INTO category (name)
    VALUES ($1)
    RETURNING category_id;
  `;

  const queryParams = [name];
  const result = await db.query(query, queryParams);

  if (result.rowCount === 0) {
    throw new Error("Failed to create category");
  }

  return result.rows[0].category_id;
};

// Update an existing category
const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;

  const queryParams = [name, categoryId];
  const result = await db.query(query, queryParams);

  if (result.rowCount === 0) {
    throw new Error("Failed to update category");
  }

  return result.rows[0].category_id;
};

export {
  getAllCategories,
  getCategoryDetails,
  getCategoryById,
  createCategory,
  updateCategory,
};
