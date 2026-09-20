import db from "./db.js";

const getAllProjects = async () => {
  const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.date, o.name
      FROM service_project sp
      JOIN organizations o
      ON sp.organization_id = o.organization_id;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
     SELECT
          project_id,
          o.organization_id,
          title,
          sp.description,
          location,
          date,
          o.name AS organization_name
        FROM service_project sp
        JOIN organizations o 
        ON sp.organization_id = o.organization_id
        WHERE sp.date >= CURRENT_DATE
        ORDER BY sp.date
        LIMIT $1;
  `;

  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = ` SELECT
          sp.project_id,
          o.organization_id,
          title,
          sp.description,
          location,
          date,
          o.name AS organization_name, category.category_id, category.name AS category_name
        FROM service_project sp
        JOIN organizations o 
        ON sp.organization_id = o.organization_id
        LEFT JOIN project_category pc ON sp.project_id = pc.project_id
        LEFT JOIN category ON pc.category_id = category.category_id
        WHERE sp.project_id = $1;`;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);
  console.log("getProjectDetails result:", result.rows); // Log the result for debugging
  return result.rows;
};
getProjectDetails(1);

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
};
