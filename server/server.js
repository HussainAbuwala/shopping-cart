/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config()
const PORT = 3000
const express = require("express")
const app = express()
const cors = require("cors")
const storeItems = require("./items.json")
console.log(storeItems)
app.use(express.json())
app.use(cors())

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

app.post("/create-checkout-session", async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.find(sI => sI.id === item.id)
                return {
                    price_data:{
                        currency: "usd",
                        product_data:{
                            name: storeItem.name
                        },
                        unit_amount: storeItem.price * 100
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/store`,
        })
        res.json({url: session.url})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

