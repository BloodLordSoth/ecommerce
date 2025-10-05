import puppeteer from 'puppeteer'
import fs from 'fs'
import pool from './schema.js'

async function scrape(url){
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url)

    const nameinfo = await page.$$eval('p[class*=runningText]', els => els.map(el => el.textContent.trim()))
    const priceinfo = await page.$$eval('span.cfpn1d', els => els.map(el => el.textContent.trim()))
    const imginfo = await page.$$eval('li img', els => els.map(el => el.src))

    const arr = []

    for (let i = 0; i < nameinfo.length; i++){
        const name = nameinfo[i]
        const price = priceinfo[i]
        const image = imginfo[i]
        arr.push({ Name: name, Price: price, Image: image })
    }

    await browser.close()
    return arr
}

async function main(){
    const urls = [
        'https://www.cemeterycrypt.com/bags',
        'https://www.cemeterycrypt.com/vests',
        'https://www.cemeterycrypt.com/jackets',
        'https://www.cemeterycrypt.com/hats'
    ]

    const allInfo = []

    for (let url of urls){
        const data = await scrape(url)
        allInfo.push(data)
    }

    fs.writeFileSync('sales.json', JSON.stringify(allInfo, null, 2))
    console.log('file Saved')

}
//main()

function conversion(){

    const file = JSON.parse(fs.readFileSync('sales.json'))

    const flat = file.flat()
    const mapper = flat.map(item => {
        const price = item.Price.trim().replace('£', '')
        const val = parseFloat(price)
        const price_in_cents = Math.round(val * 100)

        return {
            ...item,
            price_in_cents
        }
    })
    fs.writeFileSync('sales2.json', JSON.stringify(mapper, null, 2))
    console.log('file saved')
}
//conversion()

const writeToDB = async() => {
    const info = JSON.parse(fs.readFileSync('sales2.json'))

    const mapper = info.map(item => [item.Name, item.Price, item.price_in_cents, item.Image])
    const flat = mapper.flat()
    
    const query = `
    INSERT INTO products (name, price, price_in_cents, image)
    VALUES ${mapper.map((_, i) => `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`).join(', ')}
    `;

    await pool.query(query, flat)
    console.log('Added to database')
}
//writeToDB()