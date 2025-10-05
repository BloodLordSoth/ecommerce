const box = document.getElementById('box')
const defaultTxt = document.getElementById('default')
const total = document.getElementById('total')
const amt = document.getElementById('amt')

async function fetchCart(){
    const res = await fetch('/shoppingcart')

    if (!res.ok){
        window.alert('Issue connecting to server')
        return
    }
    
    const data = await res.json()
    
    
    if (data.length === 0){
        defaultTxt.textContent = 'There are no items in the shopping cart.'
        total.style.display = 'none'
        return
    }
    
    box.innerHTML = ''
    defaultTxt.textContent = ''
    const totalCents = res.headers.get('X-cart-total')
    const val = totalCents / 100
    const frmt = `£${val.toFixed(2)}`

    amt.textContent = frmt
    const btn = document.createElement('button')
    btn.classList.add('checkoutBtn')
    btn.textContent = `Checkout ${amt.textContent}`

    data.forEach(item => {
        const div = document.createElement('div')
        const delBtn = document.createElement('button')
        delBtn.classList.add('delBtn')
        delBtn.textContent = 'Remove'
        div.classList.add('append')
        div.innerHTML = `
        <p>Amt: ${item.quantity}</p>
        <img class="cartImg" width="150" height="150" src="${item.image}"/>
        <p><b>${item.name}</b></p>
        <p>${item.price}</p>
        `
        div.appendChild(delBtn)
        box.appendChild(div)
        total.appendChild(btn)
        total.style.display = 'flex'

        btn.addEventListener('click', async () => {
            const res2 = await fetch('/checkout', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    info: data.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity
                    }))
                })
            })

            const data2 = await res2.json()
            window.parent.location.href = data2.url
        })

        delBtn.addEventListener('click', async () => {
            const res = await fetch('/remove', {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.cart_item_id })
            })

            window.parent.location.reload()
        })
    })

}
fetchCart()