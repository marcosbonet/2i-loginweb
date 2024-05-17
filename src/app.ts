import express, { Application } from "express";
import routes from "./routes/auths";
import morgan from "morgan";
import cors from "cors";

const app: Application = express();

app.set("port", 3000);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
routes;
app.use(routes);

export default app;
