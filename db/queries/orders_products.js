import db from "#db/client";
/*Making an association between product and order
three parameters are stored in the function
values line as placeholders for each parameter
return the order-product thats been created */
export async function createOrderProduct(orderId, productId, quantity) {
    const sql = `
    INSERT INTO orders_products
        (order_id, product_id, quantity)
    VALUES 
        ($1, $2, $3)
    RETURNING *`;

    const { rows: [orderProduct], 
    } = await db.query(sql, [orderId, productId, quantity]);
    return orderProduct;

}