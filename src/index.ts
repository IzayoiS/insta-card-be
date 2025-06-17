import express from 'express';
import cors from 'cors';

import router from './routes/api';
import { errorHandler } from './middlewares/error.middleware';

import db from './utils/database';
import docs from './docs/router';

async function init() {
  try {
    const result = await db();

    console.log('database status: ', result);

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const PORT = 3000;

    app.get('/', (req, res) => {
      res.status(200).json({
        message: 'Server is running',
        data: null,
      });
    });

    app.use(router);
    app.use(errorHandler);
    docs(app);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
