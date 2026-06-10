import express from "express";
const app = express();
export default app;

import morgan from "morgan";

import productsRouter from "#api/products";
import ordersRouter from "#api/orders";
import usersRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(getUserFromToken);

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {

});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Sorry! There was an Error.");
});
