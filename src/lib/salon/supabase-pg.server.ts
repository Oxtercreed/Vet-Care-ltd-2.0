import pg from "pg";

let pool: pg.Pool | null = null;

function connectionString() {
  return process.env.SUPABASE_DB_URL?.trim() || "";
}

function getPool() {
  const connStr = connectionString();
  if (!connStr) return null;
  if (!pool) {
    pool = new pg.Pool({
      connectionString: connStr,
      max: 2,
      ssl: { rejectUnauthorized: false },
      idleTimeoutMillis: 10_000,
    });
  }
  return pool;
}

export async function supabaseQuery<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<{ ok: true; rows: T[] } | { ok: false }> {
  try {
    const p = getPool();
    if (!p) return { ok: false };
    const result = await p.query(text, params);
    return { ok: true, rows: result.rows as T[] };
  } catch {
    return { ok: false };
  }
}
