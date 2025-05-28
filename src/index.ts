import express from "express";

import router from "./routes/api";

import db from "./utils/database";

async function init() {
  try {
    const result = await db();

    console.log("database status: ", result);

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    const PORT = 3000;

    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
