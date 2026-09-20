import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT name, category_id
      FROM category;
    `;

  const result = await db.query(query);

  return result.rows;
};

// getCategoryDetails retrieves the name of a category based on its ID
const getCategoryDetails = async (categoryId) => {
  const query = `
    SELECT c.name, sp.project_id, sp.title
    FROM category c
    JOIN project_category cp
    ON c.category_id = cp.category_id
    JOIN service_project sp
    ON cp.project_id = sp.project_id
    WHERE c.category_id = $1; `;
  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};
getCategoryDetails(1);
export { getAllCategories, getCategoryDetails };
