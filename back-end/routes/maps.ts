import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
const router  = express.Router();

module.exports = (db: any) => {

  // Get ALL maps from db:
  router.get('/maps', (req: Request, res: Response) => {
    const queryString: string = 
      `SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username AS username FROM maps
      JOIN pins ON map_id = maps.id
      JOIN users ON maps.creator = users.id
      GROUP BY maps.id, users.username;`
      ;

    db.query(queryString)
      .then((data: any) => {
        console.log('Get MAPS', data.rows);
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Get ALL pins for a specific map:
  router.get('/pins/:map_id', (req: Request, res: Response) => {
    const map_id: string | number = req.params.map_id;

    const queryParams: (string | number)[] = [map_id];
    const queryString: string = `
      SELECT * FROM pins
      WHERE map_id = $1;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        console.log('Get Pins', data.rows);
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });

  return router;
};
