import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
const router  = express.Router();

module.exports = (db: any) => {

  // Get ALL maps from db:
  router.get('/maps', (req: Request, res: Response) => {
    const queryString: string = `SELECT * FROM maps;`;

    db.query(queryString)
      .then((data: any) => {
        console.log('Get MAPS', data.rows);
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });

  return router;
};
