import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

import { QueryResultRow } from "pg";

export async function query<T extends QueryResultRow>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  return pool.query<T>(text, params);
}
