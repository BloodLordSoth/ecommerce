import OpenAI from 'openai'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const info = JSON.parse(fs.readFileSync('./sales.json', 'utf-8'))

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const systemrole = `
- You are a helpful chat assistant for a project e-commerce website.
- Answer questions in a helpful way.
- If asked a question unrelated to the products, say you don't understand.
- If information is asked about a product's description, make one up based on the name.
`

export async function callAI(question){
    const salesInfo = JSON.stringify(info)
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemrole },
            { role: 'system', content: `Sales_Data - ${salesInfo}` },
            { role: 'user', content: question }
        ]
    })

    const reply = response.choices[0].message.content
    return reply
}