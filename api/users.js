import express from "express";
const router = express.Router();
export default router;
/* Importing all functions from relevant files so
the API knows the data to access and use */
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
/*Route handler used to created an account for user
 requireBody ensures username and pw exist
 create user and a token for correct login credentials
 send a 201 response that token was successfully created and 
 returned
 */
router.post(
    "/register",
    requireBody(["username", "password"]),
    async (req, res) => {
        const { username, password } = req.body;
        const user = await createUser(username, password);
        const token = createToken({ id: user.id});
        
        return res.status(201).send(token);
    },
);

/* Finds user with the correct username and password
token is created for the user
if username and password are incorrect return authentication error 401
return the created token
 */
router.post(
    "/login", requireBody(["username", "password"]), async (req, res) => {
        const { username, password } = req.body;
        const user = await getUserByUsernameAndPassword(username, password);
        if (!user) return res.status(401).send()
        const token = createToken({ id: user.id});
        res.send(token);
    },
);