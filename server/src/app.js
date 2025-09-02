import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ALLOWED_ORIGIN } from "./config/constants.js";
import customersRouter from "./routes/customers.route.js";
import addressesRouter from "./routes/addresses.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
);
app.use(express.json());

app.use("/api/customers", customersRouter);
app.use("/api/addresses", addressesRouter);
app.use(errorMiddleware);

export default app;
