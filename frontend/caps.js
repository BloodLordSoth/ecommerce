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

            btn.addEventListener('click', (e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('clicked')
            })

            div.addEventListener('click', () => {
                const id = localStorage.setItem('link', item.id)
                window.location.href = `products.html`
            })
        })
    }
    getCaps()