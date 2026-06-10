import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createOrder } from "#db/queries/orders";
import { createProduct } from "#db/queries/products";
import { createOrderProduct } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  /* Create a loop to create 10 products
  create a user and an order for the user
  another loop is made for 5 products out of the 10
  and each product is added to the one order created 
  the quantity is 3 */
  for (let i = 1; i <= 10; i++) {
    await createProduct("Product " + i, "Description " + i, i * 10000);
  }
    const user = await createUser("uniqueUser", "password");
    const order = await createOrder("2026-06-09", user.id);
  for (let j = 1; j <= 5; j++) {
    await createOrderProduct(order.id, j, 3);
      
  }
} 

