import pg from 'pg'

// Pool de conexiones a PostgreSQL. Los datos vienen del archivo .env
export const pool = new pg.Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'Notas Rapidas'
})
