import express from "express";
import cors from "cors";

import router from "./routes/api";
import db from "./utils/database";
import docs from "./docs/router";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    data: null,
  });
});

app.use("/api", router);
docs(app);

db()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
  });

export default app;
