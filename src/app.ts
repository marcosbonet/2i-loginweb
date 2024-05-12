import express, { Application } from "express";
import routes from "./routes/auths";
import morgan from "morgan";
import { checkDatabase } from "./database/checkdatabase";
checkDatabase();
const app: Application = express();

//setting
app.set("port", 3000);

//middlewares

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//routes
app.use(routes);

export default app;
