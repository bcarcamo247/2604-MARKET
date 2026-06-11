import bcrypt from "bcrypt";
import db from "#db/client";
/* create a user store the username and pw
password is hashed to make it more secure
return created user */
export async function createUser(username, password) {
    const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING *`;

    const hashedPassword = await bcrypt.hash(password, 10)
    const { rows: [user], } = await db.query(sql, [username, hashedPassword]);
    return user;
}
/* The USER contains a specific username that allows us
to find the user by the username if there is no user with
that username then return nothing, the password given is 
compared with the real password if the correct password is not 
provided, return nothing, lastly return the USER
*/
export async function getUserByUsernameAndPassword(username, password) {
    const sql = `
    SELECT *
    FROM users
    WHERE username = $1`;

    const { rows: [user], } = await db.query(sql, [username]);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    return user;
}
/*Find the user by their id and if found
return the user that matches */
export async function getUserById(id) {
    const sql = `
    SELECT *
    FROM users 
    WHERE id = $1`;

    const { rows: [user], } = await db.query(sql, [id]);
    return user;
}