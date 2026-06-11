import express from "express";
const router = express.Router();
export default router;

import { getProducts, getProductById } from "#db/queries/products";
import { getOrdersByProductId } from "#db/queries/orders";
import requireUser from "#middleware/requireUser";
/*Get all products from database and return them */
router.get("/", async (req, res) => {
    const products = await getProducts();
    res.send(products);
});
/*Find the product by its ID
Return an error if there is no product with that ID
If not return the product with the ID */
router.get("/:id", async (req, res) => {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product doesn't exist!");
    res.send(product);
});
/*Find orders with the specific product.
An error is sent if that product does not exist.
If it does, send all orders containing that product.  */
router.get("/:id/orders", 
    requireUser,
    async (req, res) => {
    const product = await getProductById(req.params.id);

    if (!product) return res.status(404).send("Product doesn't exist!");

    const orders = await getOrdersByProductId(req.params.id);
    res.send(orders); 
});