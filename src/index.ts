import express from "express";
import userController from "./controller/UserController";

const app = express();

app.use(express.json());

app.use(userController);

const port: number = 3000;
app.listen(port);
console.log(`Server now running on port: ${port}`);