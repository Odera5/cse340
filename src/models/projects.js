import db from "./db.js";

const getAllProjects = async () => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.date,
      o.organization_id,
      o.name AS organization_name
    FROM service_project sp
    JOIN organizations o
    ON sp.organization_id = o.organization_id
    ORDER BY sp.date;
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
  return result.rows;
};

const createProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
  INSERT INTO service_project
  (title, description, location, date, organization_id)
  VALUES
  ($1,$2,$3,$4,$5)
  RETURNING project_id;`;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rowCount == 0) {
    throw new Error("failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (
  projectId,
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
    UPDATE service_project
    SET
      title = $1,
      description = $2,
      location = $3,
      date = $4,
      organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const queryParams = [
    title,
    description,
    location,
    date,
    organizationId,
    projectId,
  ];

  const result = await db.query(query, queryParams);

  if (result.rowCount === 0) {
    throw new Error("Failed to update project");
  }

  return result.rows[0].project_id;
};


const getProjectCategoryIds = async (projectId) => {
  const query = `
    SELECT category_id
    FROM project_category
    WHERE project_id = $1
    ORDER BY category_id;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows.map((row) => row.category_id);
};

const updateProjectCategories = async (projectId, categoryIds) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM project_category WHERE project_id = $1",
      [projectId],
    );

    await client.query(
      `INSERT INTO project_category (project_id, category_id)
       SELECT $1, selected.category_id
       FROM UNNEST($2::int[]) AS selected(category_id)`,
      [projectId, categoryIds],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return projectId;
};


export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
    getProjectCategoryIds,
  updateProjectCategories,
};
