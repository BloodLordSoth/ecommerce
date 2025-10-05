import fs from 'fs'
import pool from '../schema.js'

const info = JSON.parse(fs.readFileSync('sales.json'))

const mapper = info.flatMap(category => 
    category.map(item => ({
        Name: item.Name,
        Price: item.Price,
        Image: item.Image
    }))
)

const values = mapper.map(item => [item.Name, item.Price, item.Image])

const flatten = values.flat()

async function writeToDB(){
    const query = `
    INSERT INTO products (name, price, image)
    VALUES ${values.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(', ')}
    `;
    await pool.query(query, flatten)
    console.log('work done')
}
writeToDB()