import puppeteer from 'puppeteer'
import fs from 'fs'

async function scrape(url){
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url)

    const nameInfo = await page.$$eval('p[class*=runningText]', elx => elx.map(el => el.textContent.trim()))
    const priceInfo = await page.$$eval('span.cfpn1d', elx => elx.map(el => el.textContent.trim()))
    const imgInfo = await page.$$eval('li img', elx => elx.map(el => el.src) )

    const arr = []

    for (let i = 0; i < nameInfo.length; i++){
        const name = nameInfo[i]
        const price = priceInfo[i]
        const image = imgInfo[i]
        arr.push({ Name: name, Price: price, Image: image })
    }

    await browser.close()
    return arr
}

async function main(){
    const urls = [
        'https://www.cemeterycrypt.com/hats',
        'https://www.cemeterycrypt.com/bags',
        'https://www.cemeterycrypt.com/jackets',
        'https://www.cemeterycrypt.com/vests'
    ]

    const allInfo = []

    for (let url of urls){
        const data = await scrape(url)
        allInfo.push(data)
    }

    fs.writeFileSync('sales.json', JSON.stringify(allInfo, null, 2))
    console.log('Sales have been saved')
}
main()