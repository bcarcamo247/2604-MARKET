import express from "express";
const router = express.Router();
export default router;

import { createOrder, getOrderById, getOrders, getOrdersByUserId } from "#db/queries/orders";
import { createOrderProduct } from "#db/queries/orders_products";
import { getProductsByOrderId, getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
/* Allows only approved users to access order routes */
router.use(requireUser);

/*Destruct the date to then specificy that if no date is included
in order send back error that it is required. Create an order for the 
logged in user and return that created order.*/
router.post("/", requireUser, async (req, res) => {
    const { date } = req.body;
    if (!date) return res.status(400).send("Date is required!");

    const order = await createOrder(date, req.user.id);
    res.status(201).send(order);
});
/* Return the orders from the logged in user */
router.get("/", requireUser, async (req, res) => {
    const orders = await getOrdersByUserId(req.user.id);
    res.send(orders);
});
/*An order has an id it can be identified by that it belongs
to the logged in user. An error is sent if that id doesnt match the
logged in user's id indicating its not the user who placed
the order. Send back that order that matches. */
router.get("/:id",
    requireUser,
    async (req, res) => {
         const order = await getOrderById(req.params.id);
        if (!order) { 
            return res.status(404).send("Order does not exist.");
        }
        if (order.user_id != req.user.id) {
            return res.status(403).send("Incorrect User.");
        }
        res.send(order);
});
/*Associate the quantity and product to an order.
Middleware ensures the correct order and product exist.
Errors are sent for the user who made order whos id doesnt match
and for not providing productID and quantity for an order
Once verified they exist send back 201 response of the
created order_product.
  */
router.post("/:id/products",
    requireUser,
    requireBody(["productId", "quantity"]),
    async (req, res) => {
        const order = await getOrderById(req.params.id);
        if (!order) return res.status(404).send("Order does not exist.");

        if (order.user_id != req.user.id) {
            return res.status(403).send("Incorrect User.");
        }

        const { productId, quantity } = req.body;
        if (!req.body) return res.status(400).send("Must include productId and quantity.");

        const product = await getProductById(productId);
        if (!product) return res.status(400).send("Product provided does not exist.");

        const orderProduct = await createOrderProduct(
            order.id,
            productId,
            quantity,
        );
        res.status(201).send(orderProduct);
    });
/*Ensures order belongs to the logged in user and
all products that are connected to an order, return them. */
router.get("/:id/products",
    requireUser,
    async (req, res) => {
    const order = await getOrderById(req.params.id);

    if (!order) return res.status(404).send("Order does not exist.");

    if (order.user_id != req.user.id) {
        return res.status(403).send("Invalid User.");
    }
    const products = await getProductsByOrderId(order.id);

    res.send(products);
    
});