import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import auth from "./routes/auth";
import boards from "./routes/boards";
import errorHandler from "./middleware/errorHandler";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.use("/api/auth", auth);
app.use("/api/boards", boards);

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
