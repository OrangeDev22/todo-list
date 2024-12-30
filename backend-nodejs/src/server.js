import express from "express";

const PORT = process.env.PORT;

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ msg: "Hello world!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
