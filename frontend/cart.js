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
        <p>${item.name} |</p>
        <p>${item.quantity} |</p>
        <p>${item.price}</p>
        <img src="${item.image}" width="100" height="100"/>
        `
        div.appendChild(delBtn)
        box.appendChild(div)
        total.appendChild(btn)
        total.style.display = 'flex'

        delBtn.addEventListener('click', async () => {
            const res = await fetch('/remove', {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.cart_item_id })
            })

            window.location.reload()
        })
    })

}
fetchCart()