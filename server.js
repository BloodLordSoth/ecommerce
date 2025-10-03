import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './schema.js'

const app = express()
const PORT = 4700
app.use(express.json())
app.use(cors())
const __file = fileURLToPath(import.meta.url)
const __dir = path.dirname(__file)
app.use(express.static(path.join(__dir, 'frontend')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dir, 'frontend', 'index.html'))
})

app.get('/products/bags', async (req, res) => {
    try {
        const data = await pool.query(
            'SELECT * FROM products WHERE name ILIKE $1',
            [`%bag%`]
        )
        res.status(200).send(data.rows)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})


app.get('/products', (req, res) => {
    res.sendFile(path.join(__dir, 'frontend', 'products.html'))
})

app.get('/bags', (req, res) => {
    res.sendFile(path.join(__dir, 'frontend', 'bags.html'))
})

app.get('/shopping-cart', (req, res) => {
    res.sendFile(path.join(__dir, 'frontend', 'cart.html'))
})

app.post('/query', async (req, res) => {
    const input = req.body.input

    if (!input) return res.sendStatus(401);

    try {
        const data = await pool.query(
            `SELECT * FROM products WHERE name ILIKE $1`,
            [`%${input}%`]
        )
        res.status(200).send(data.rows)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.get('/products/:id', async (req, res) => {
    const id = req.params.id

    if (!id) return res.sendStatus(401);

    try {
        const data = await pool.query(
            'SELECT * FROM products where id = $1',
            [id]
        )
        res.status(200).send(data.rows[0])
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.listen(PORT, () => {
    console.log(`Running on localhost:${PORT}`)
})