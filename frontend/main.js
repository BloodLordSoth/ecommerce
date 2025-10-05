//import { marked } from 'marked'
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
const cartBox = document.getElementById('cartBox')
const chat = document.getElementById('chat')
const closechat = document.getElementById('closechat')
const chatbox = document.getElementById('chatboxcontainer')
const form = document.getElementById('form')
const chatwindow = document.getElementById('chatbox')
const chatBtn = document.getElementById('chatBtn')
const chatmessage = document.getElementById('chatmessage')

let debuffTime;
let isopen = false;

const succ = localStorage.getItem("success")
if (succ){
    iframe.src = 'success.html'
}

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

cart.addEventListener('click', () => {
    iframe.src = 'cart.html'
})

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (chatmessage.value.length === 0){
        return
    }

    const msg = document.createElement('div')
    msg.textContent = chatmessage.value
    msg.classList.add('user')
    chatwindow.appendChild(msg)

    const res = await fetch('/sendchat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatmessage.value })
    })
    
    chatmessage.value = ''
    chatwindow.scrollTop = chatwindow.scrollHeight

    if (!res.ok){
        window.alert('Error connection with server')
        return
    }

    const data = await res.json()
    const aidiv = document.createElement('div')
    aidiv.innerHTML = data.reply
    aidiv.classList.add('aidiv')
    chatwindow.appendChild(aidiv)
    chatwindow.scrollTop = chatwindow.scrollHeight
    
})

chat.addEventListener('click', () => {
    closechat.style.display = 'flex'
    chat.style.display = 'none'
    chatbox.style.animation = 'appear 1s forwards'
    chatbox.style.display = 'flex'
})

closechat.addEventListener('click', () => {
    closechat.style.display = 'none'
    chat.style.display = 'flex'
    chatbox.style.animation = 'vanish 1s forwards'
    chatbox.style.display = 'none'
})

cart.addEventListener('mouseover', () => {
    cartBox.style.display = 'flex'
})

home.addEventListener('click', () => {
    iframe.src = 'home.html'
})

products.addEventListener('mouseenter', () => {
    productBox.style.display = 'flex'
})

window.addEventListener('click', () => {
    productBox.style.display = 'none'
    cartBox.style.display = 'none'
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

async function callBox(){
    const res = await fetch('/shoppingcart')

    const data = await res.json()
    const btn = document.createElement('button')
    const total = res.headers.get('X-cart-total')
    const val = total / 100
    const totalVal = `£${val.toFixed(2)}`
    btn.classList.add('checkoutBtn')
    btn.textContent = `Checkout: ${totalVal}`
    data.forEach(item => {
        const id = item.product_id
        const div = document.createElement('div')
        div.classList.add('cartappend')
        div.innerHTML = `
        <p class="cartTxt">${item.quantity}</p>
        <img class="cartImg" width="75" height="75" src="${item.image}"/>
        <p class="cartTxt">${item.name}</p>
        <p class="cartTxt">${item.price}</p>
        `
        cartBox.appendChild(div)
        cartBox.appendChild(btn)

        div.addEventListener('click', () => {
            localStorage.setItem("link", id)
            iframe.src = `products.html`
        })
    })
}
callBox()
