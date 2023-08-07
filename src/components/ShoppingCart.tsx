import { Offcanvas, Stack } from "react-bootstrap"
import { useShoppingCart } from "../context/ShoppingCartContext"
import { formatCurrency } from "../utilities/formatCurrency"
import { CartItem } from "./CartItem"
import storeItems from "../data/items.json"

type ShoppingCartProps = {
    isOpen: boolean
}

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
    console.log(import.meta.env.VITE_SERVER_URL)
    const { closeCart, cartItems } = useShoppingCart()

    function handleCheckout(){
        fetch(`${import.meta.env.VITE_SERVER_URL}/create-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: cartItems
            })
        }).then(res => {
            if(res.ok) return res.json()
            else return res.json().then(json => Promise.reject(json))
        }).then(({url}) => {
            window.location = url
        }).catch(e => {
            console.error(e.error)
        })
    }

    return (
        <Offcanvas show={isOpen} onHide={closeCart} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {cartItems.map(item => (
                        <CartItem key={item.id} {...item} />
                    ))}
                    <div className="ms-auto fw-bold fs-5">
                        Total{" "}
                        {formatCurrency(
                            cartItems.reduce((total, cartItem) => {
                                const item = storeItems.find(i => i.id === cartItem.id)
                                return total + (item?.price || 0) * cartItem.quantity
                            }, 0)
                        )}
                    </div>
                    <button onClick={handleCheckout} type="button" className="btn btn-dark">Checkout</button>
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    )
}