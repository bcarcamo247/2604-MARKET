import db from "#db/client";
/*Creating orders, connect user to the orders
and also storing the date of the order. Finally
return the order that we created*/ 
export async function createOrder(date, user_id) {
    const sql = `
    INSERT INTO ORDERS
        (date, user_id)
    VALUES ($1, $2)
    RETURNING *`;

    const { rows: [order], } = await db.query(sql, [date, user_id]);
    return order;
}
/*Function that allows database to receive all the orders
and returns them*/
export async function getOrders() {
    const sql = `
    SELECT *
    FROM orders`;

    const { rows: orders } = await db.query(sql);
    return orders;
}
/*Match an order with an id find order with that id
The order that matches is returned */
export async function getOrderById(id) {
    const sql = `
    SELECT * 
    FROM orders
    WHERE id = $1`;

    const { rows: [order], } = await db.query(sql, [id]);
    return order;
}
/*Order and orders_products tables being joined
finds an order that has a certain product
return the orders that match */
export async function getOrdersByProductId(productId) {
    const sql = `
    SELECT orders.*
    FROM orders
    JOIN orders_products ON orders_products.order_id = orders.id
    WHERE orders_products.product_id = $1;`;

    const { rows: orders } = await db.query(sql, [productId]);
    return orders;
}
/*Find the orders that  belong to the user
return the orders that match */
export async function getOrdersByUserId(userId) {
    const sql = `
    SELECT *
    FROM orders
    WHERE user_id = $1;`;

    const { rows: orders } = await db.query(sql, [userId]);
    return orders;
}