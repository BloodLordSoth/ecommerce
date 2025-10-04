const box = document.getElementById('box')

    async function getCaps(){
        const res = await fetch('/products/caps')

        const data = await res.json()
        data.forEach(item => {
            const btn = document.createElement('button')
            btn.textContent = 'Add to Cart'
            btn.classList.add('btn1')
            const div = document.createElement('div')
            div.classList.add('append')
            div.innerHTML = `
            <img width="150" height="150" src="${item.image}"/>
            <p><b>${item.name}</b></p>
            <p>${item.price}</p>
            `
            div.appendChild(btn)
            box.appendChild(div)

            btn.addEventListener('click', async (e) => {
                e.preventDefault()
                e.stopPropagation()
                const res = await fetch('/addtocart', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemID: item.id, amount: '1'})
                })

                if (!res.ok){
                    window.alert('Error connecting to the server')
                    return
                }

                const yay = document.createElement('p')
                yay.style.color = 'lightgreen'
                yay.style.marginLeft = '10px'
                yay.textContent = 'Success'
                div.appendChild(yay)
                setTimeout(() => {
                    div.removeChild(yay)
                }, 2000)
            })

            div.addEventListener('click', () => {
                const id = localStorage.setItem('link', item.id)
                window.location.href = `products.html`
            })
        })
    }
    getCaps()