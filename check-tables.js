import db from "./src/models/db.js";

try {
  const result = await db.query(
    "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name",
    ["public"]
  );
  console.table(result.rows);
} catch (error) {
  console.error(error.message);
} finally {
  await db.end?.();
}
