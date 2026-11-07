import express from 'express'
import { pool } from './db.js'

const app = express()
app.use(express.json())

// Devuelve "fecha" como YYYY-MM-DD, que es el formato que usa la app
const COLUMNAS = `id, titulo, contenido, to_char(fecha, 'YYYY-MM-DD') AS fecha`

// Comprobar la conexión
app.get('/api/salud', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Listar notas
app.get('/api/notas', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${COLUMNAS} FROM notas ORDER BY fecha DESC, id DESC`
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// Crear o actualizar una nota (upsert por id: así se puede reintentar sin duplicar)
async function guardarNota(req, res, next) {
  try {
    const id = req.params.id || req.body.id
    const { titulo = '', contenido = '', fecha } = req.body
    if (!id) return res.status(400).json({ error: 'Falta el id' })

    const { rows } = await pool.query(
      `INSERT INTO notas (id, titulo, contenido, fecha)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE))
       ON CONFLICT (id) DO UPDATE
         SET titulo = EXCLUDED.titulo,
             contenido = EXCLUDED.contenido,
             fecha = EXCLUDED.fecha
       RETURNING ${COLUMNAS}`,
      [id, titulo, contenido, fecha || null]
    )
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}
app.post('/api/notas', guardarNota)
app.put('/api/notas/:id', guardarNota)

// Eliminar una nota
app.delete('/api/notas/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM notas WHERE id = $1', [req.params.id])
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, async () => {
  console.log(`API escuchando en http://localhost:${PORT}`)
  try {
    await pool.query('SELECT 1')
    console.log(`Conectado a PostgreSQL (base de datos "${pool.options.database}")`)
  } catch (err) {
    console.error('No se pudo conectar a PostgreSQL:', err.message)
  }
})
