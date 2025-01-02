import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler";
import routes from "./config/routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes dynamically
routes.forEach(({ path, handler, middleware }) => {
  if (middleware) {
    app.use(path, middleware, handler);
  } else {
    app.use(path, handler);
  }
});

app.get("/", (req, res) => {
  res.json({ msg: "Hello world!" });
});

// Route not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ msg: "Route not found" });
  next();
});

// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
