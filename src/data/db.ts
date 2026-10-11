import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || "ladygasy_db",
  user: process.env.PGUSER || "ladygasy_admin",
  password: process.env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
});

export default pool;
