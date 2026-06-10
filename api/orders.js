import express from "express";
const router = express.Router();
export default router;

import { createOrder, getOrderById, getOrders, getOrdersByUserId } from "#db/queries/orders";
import { createOrderProduct } from "#db/queries/orders_products";
import { getProductsByOrderId, getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);


router.post("/", requireUser, async (req, res) => {
    const { date } = req.body;
    if (!date) return res.status(400).send("Date is required!");

    const order = await createOrder(date, req.user.id);
    res.status(201).send(order);
});

router.get("/", requireUser, async (req, res) => {
    const orders = await getOrdersByUserId(req.user.id);
    res.send(orders);
});

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