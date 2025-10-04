const imgCont = document.getElementById('imgCont')
const txtCont = document.getElementById('txtCont')
const counter = document.getElementById('counter')
const plus = document.getElementById('plus')
const minus = document.getElementById('minus')
const btn1 = document.getElementById('btn1')
const added = document.getElementById('added')
btn1.textContent = 'Add to cart'
    

const link = localStorage.getItem('link')

async function bags(){
    const res = await fetch(`/products/${link}`)

    const data = await res.json()
    imgCont.innerHTML = `
    <img width="200" height="200" src="${data.image}"/>
    `
    txtCont.innerHTML = `
    <p>${data.name}</p>
    <p>${data.price}</p>
    `
}
bags();

let num = 1
counter.textContent = num
plus.addEventListener('click', () => {
    num++
    counter.textContent = num
})

minus.addEventListener('click', () => {
    if (num > 1){
        num--
        counter.textContent = num
    }
})

btn1.addEventListener('click', async () => {

    const dataObj = {
        itemID: link,
        amount: num
    }

    console.log(dataObj)
    const res = await fetch('/addtocart', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObj)
    })

    
    if (res.ok){
        added.style.display = 'inline'
        setTimeout(() => {
            added.style.display = 'none'
        }, 3000)
    } else {
        window.alert('Issue connecting to the server')
    }

})