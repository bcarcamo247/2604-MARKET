import db from "#db/client";
/* Create a product which contain parameters title,
description, and price that are stored
Return the product created */
export async function createProduct(title, description, price) {
    const sql = `
    INSERT INTO products
        (title, description, price)
    VALUES 
        ($1, $2, $3)
    RETURNING *`;

    const { rows: [product], } = await db.query(sql, [title, description, price]);
    return product;
}
/*The database receives the products
return the products */
export async function getProducts() {
    const sql = `
    SELECT *
    FROM products`;

    const { rows: products } = await db.query(sql);
    return products;
}
/*finds products that are associated with an order
join two tables orders and orders_products to share data
the products that match are then returned  */
export async function getProductsByOrderId(id) {
    const sql = `
    SELECT products.*
    FROM products
        JOIN orders_products ON orders_products.product_id = products.id
        JOIN orders ON orders.id = orders_products.order_id
    WHERE orders.id = $1
    `;
    const { rows: products } = await db.query(sql, [id]);
    return products;
}
/*Find a product with specific id
Return that specific product that matches with the id */
export async function getProductById(id) {
    const sql = `
    SELECT *
    FROM products
    WHERE id = $1
    `;
    const { rows: [product],
    } = await db.query(sql, [id]);
    return product;
}
