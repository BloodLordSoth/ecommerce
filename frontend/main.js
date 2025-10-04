const message = document.getElementById('message')
const box = document.getElementById('box')
const cart = document.getElementById('cart')
const iframe = document.getElementById('iframe')
const home = document.getElementById('home')
const products = document.getElementById('products')
const productBox = document.getElementById('productBox')
const prodBags = document.getElementById('prodBags')
const prodCaps = document.getElementById('prodCaps')
const prodJackets = document.getElementById('prodJackets')
const prodVests = document.getElementById('prodVests')

let debuffTime;

message.addEventListener('input', () => {
    clearTimeout(debuffTime)

    if (message.value.length > 0){
        box.style.display = 'flex'
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
                <p>${item.name}  </p>
                <p>${item.price}</p>
                <img width="100" height="100" src="${item.image}"/>
                `
                box.appendChild(div)

                div.addEventListener('click', () => {
                    message.value = ''
                    localStorage.setItem('link', item.id)
                    iframe.src = `products.html`
                    box.style.display = 'none'
                    box.innerHTML = ''
                })
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

window.addEventListener('beforeunload', () => {
    localStorage.removeItem('link')
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

prodCaps.addEventListener('click', () => {
    iframe.src = 'caps.html'
})

prodJackets.addEventListener('click', () => {
    iframe.src = 'jackets.html'
})

prodVests.addEventListener('click', () => {
    iframe.src = 'vests.html'
})