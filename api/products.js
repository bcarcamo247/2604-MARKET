import express from "express";
const router = express.Router();
export default router;

import { getProducts, getProductById } from "#db/queries/products";
import { getOrdersByProductId } from "#db/queries/orders";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res) => {
    const products = await getProducts();
    res.send(products);
});

router.get("/:id", async (req, res) => {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product doesn't exist!");
    res.send(product);
});

router.get("/:id/orders", 
    requireUser,
    async (req, res) => {
    const product = await getProductById(req.params.id);

    if (!product) return res.status(404).send("Product doesn't exist!");

    const orders = await getOrdersByProductId(req.params.id);
    res.send(orders); 
});