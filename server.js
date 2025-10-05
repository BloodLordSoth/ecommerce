import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './schema.js'
import { sendMail } from './mailer.js'
import { callAI } from './aiassist.js'

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

app.get('/products/vests', async (req, res) => {
    try {
        const data = await pool.query(
            'SELECT * FROM products WHERE name ILIKE $1',
            [`%vest%`]
        )
        res.status(200).send(data.rows)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.get('/products/caps', async (req, res) => {
    try {
        const data = await pool.query(
            'SELECT * FROM products WHERE name ILIKE $1',
            [`%cap%`]
        )
        res.status(200).send(data.rows)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.post('/addtocart', async (req, res) => {
    const { itemID, amount } = req.body

    if (!itemID || !amount) return res.sendStatus(401);

    try {
        await pool.query(
            'INSERT INTO cart_items (product_id, quantity) VALUES ($1, $2) ON CONFLICT (product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity',
            [itemID, amount]
        )
        res.sendStatus(200)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.delete('/remove', async (req, res) => {
    const id = req.body.id

    if (!id) return res.sendStatus(404);

    try {
        await pool.query(
            'DELETE FROM cart_items WHERE id = $1',
            [id]
        )
        res.sendStatus(200)
    }
    catch (e){
        console.error(e)
        res.sendStatus(500)
    }
})

app.get('/shoppingcart', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        ci.id AS cart_item_id,
        ci.quantity,
        p.name,
        p.price,
        p.image
      FROM cart_items ci
      JOIN products p
        ON ci.product_id = p.id
    `);
                
        res.status(200).send(result.rows)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.get('/products/jackets', async (req, res) => {
    try {
        const data = await pool.query(
            'SELECT * FROM products WHERE name ILIKE $1',
            [`%jacket%`]
        )
        res.status(200).send(data.rows)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.post('/signup', (req, res) => {
    const email = req.body.email

    if (!email) return res.sendStatus(401);

    try {
        sendMail(email)
        res.sendStatus(200)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.post('/sendchat', async (req, res) => {
    const message = req.body.message

    if (!message) return res.sendStatus(401);

    try {
        const data = await callAI(message)
        res.status(200).send({ reply: data })
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

app.get('/vests', (req, res) => {
    res.sendFile(path.join(__dir, 'frontend', 'bags.html'))
})

app.get('/jackets', (req, res) => {
    res.sendFile(path.join(__dir, 'frontend', 'jackets.html'))
})

app.get('/caps', (req, res) => {
    res.sendFile(path.join(__dir, 'frontend', 'caps.html'))
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