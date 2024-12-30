import express from "express";
import dotenv from "dotenv";
import auth from "./routes/auth";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.use("/auth", auth);

app.get("/", (req, res) => {
  res.json({ msg: "Hello world!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
