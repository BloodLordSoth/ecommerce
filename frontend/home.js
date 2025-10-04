const join = document.getElementById('join')
const email = document.getElementById('email')

join.addEventListener('click', async () => {
    if (email.value.length === 0){
        return
    }

    if (email.value.slice(-10) !== '@gmail.com'){
        window.alert('Must be a gmail address')
        return
    }

    const res = await fetch('/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value })
    })

    if (!res.ok){
        return
    }

    email.value = ''
    window.alert('Email sent')
})