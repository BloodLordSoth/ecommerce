# Capstone project e-commerce site

### Demo
**[https://ecommerce-g8ej.onrender.com/](https://ecommerce-g8ej.onrender.com/)**


## Images

![gifpic](./frontend/assets/ecommerce.gif)

<br>

![pic1](./frontend/assets/cryptss2.png)

<br>

![pic2](./frontend/assets/cryptss.png)

<br>

## Description

- This is my Boot.dev capstone project, and another one for the portfolio. This project allows a user to search for products inside a database, add items to cart, remove items, purchase them through Stripe's API, and communicate with an openAI chatbot which was fed the scraped product data for the project.

## Stack/Dependencies
```
- Frontend HTML/CSS/Javascript
- Backend Node.js/express
- dependencies express cors dotenv pg nodemailer stripe openai puppeteer fs
- devDependencies nodemon node-pg-migrate

- Included: within the tools dir, I've included my Puppeteer data scraping function, and the method I used to map the product information to the database.
```

## What I've learned
```
- With this project I've learned how to incorporate Stripe payments.

- I've learned ways to map data I scraped with Puppeteer to batch insert information into my postgres database table.

- Learned about price_in_cents and creating conversion helper tools to map my converted prices to be accepted by Stripe.

- I've learned how to build databases in relation to products and shopping carts.

- Learned how to query more than one table at once with JOIN SQL query to send back data from 2 tables to my frontend.

- Learned how to handle Stripe webhooks upon successful transaction.

- Learned Frontend concepts like stopPropagation and new URLSearchParams for iframes.

```

<br>

---
### BloodLordSoth
[GitHub](http://github.com/BloodLordSoth) | [YouTube](http://youtube.com/@BloodLordSoth)