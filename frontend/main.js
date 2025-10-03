const message = document.getElementById('message')
const box = document.getElementById('box')
const cart = document.getElementById('cart')
const iframe = document.getElementById('iframe')
const home = document.getElementById('home')
const products = document.getElementById('products')
const productBox = document.getElementById('productBox')
const prodBags = document.getElementById('prodBags')

let debuffTime;

message.addEventListener('input', () => {
    clearTimeout(debuffTime)

    if (message.value.length > 0){
        debuffTime = setTimeout(async () => {
            const res = await fetch('/query', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: message.value })
            })

            box.style.padding = '5px'
            const data = await res.json()
            data.forEach(item => {
                const div = document.createElement('div')
                div.style.margin = "10px"
                div.classList.add('append')
                div.innerHTML = `
                <p>${item.name}</p>
                <p>${item.price}</p>
                <img width="100" height="100" src="${item.image}"/>
                `
                box.appendChild(div)
            })
        }, 400)
    } else {
        box.innerHTML = ''
        box.style.padding = '0px'
    }
})

window.addEventListener('load', () => {
    message.value = ''
})

cart.addEventListener('click', () => {
    iframe.src = 'cart.html'
})

home.addEventListener('click', () => {
    iframe.src = 'home.html'
})

products.addEventListener('mouseenter', () => {
    productBox.style.display = 'flex'
})

document.addEventListener('click', () => {
    productBox.style.display = 'none'
})

prodBags.addEventListener('click', () => {
    iframe.src = 'bags.html'
})