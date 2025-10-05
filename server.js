import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './schema.js'
import { sendMail } from './mailer.js'
import { callAI } from './aiassist.js'
import Stripe from 'stripe'

const app = express()
const PORT = 4700
const stripe = new Stripe(process.env.STRIPE_API_KEY)
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

app.post('/checkout', async (req, res) => {
    const items = req.body.info

    if (!items) return res.sendStatus(401);

    try {
        const mapper = new Map(items.map(item => [item.product_id, item.quantity]))
        const prod_ids = items.map(item => [item.product_id])

        const prodDB = await pool.query(
            'SELECT * FROM products WHERE id = ANY($1)',
            [prod_ids]
        )

        const line_items = prodDB.rows.map(item => {
            const quantity = mapper.get(item.id)

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price_in_cents
                },
                quantity: quantity
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`,
        })

        res.status(200).send({ url: session.url })
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
        p.image,
        p.id
      FROM cart_items ci
      JOIN products p
        ON ci.product_id = p.id
    `);
    
    //const mapper = result.flat()
    const fgmap = result.rows.map(item => {
        const info = item.price.trim().replace('£', '')
        const val = parseFloat(info)
        const price_in_cents = Math.round(val * 100)
        const quant = item.quantity
        const total = quant * price_in_cents
        const product_id = item.id

        return {
            ...item,
            price_in_cents,
            product_id,
            total
        }
    })
    const cartTotalCents = fgmap.reduce((acc, item) => acc + item.total, 0)
        res.set("X-cart-total", cartTotalCents)
        res.status(200).send(fgmap)
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