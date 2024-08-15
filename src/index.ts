import express, {Express} from "express";
import userController from "./controller/UserController";
import emailController from "./controller/EmailController";
import adminController from "./controller/AdminController";
import {auth} from "./middleware/Authentication";
import {adminAuth} from "./middleware/AdminAuthentication";

const app: Express = express();

app.use(express.json());

app.use("/user", userController);
app.use("/email", auth, emailController);
app.use("/admin", auth, adminAuth, adminController);

const port: number = 3001;
app.listen(port);
console.log(`Server now running on port: ${port}`);