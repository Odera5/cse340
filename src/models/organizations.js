import db from "./db.js";

const getAllOrganizations = async () => {
  const query = `
        SELECT organization_id, name, description, email, logo_filename
      FROM organizations;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getOrganizationDetails = async (organizationId) => {
  const query = `
      SELECT
        o.organization_id,
        o.name AS organization_name,
        o.description,
        o.email,
        o.logo_filename,
        title
      FROM organizations o
      JOIN service_project ON o.organization_id = service_project.organization_id
      WHERE o.organization_id = $1;
    `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  //Return the first row of the result set, or null if no rows are found
  return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllOrganizations, getOrganizationDetails };
