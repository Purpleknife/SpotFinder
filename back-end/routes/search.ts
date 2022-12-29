import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
const router  = express.Router();

module.exports = (db: any) => {

  // Route to search for maps titles:
  router.get('/search', (req: Request, res: Response) => {
    const title: any = req.query.title;
    const location: any = req.query.location;
    const limit: number = 10;

    let queryParams: (string | number)[] = [];
    let queryString: string = `SELECT * FROM maps `;

    if (title) {
      queryParams.push(`%${title}%`);
      queryString += queryParams.length > 1
        ? `AND LOWER(title) LIKE $${queryParams.length} `
        : `WHERE LOWER(title) LIKE $${queryParams.length} `;
      ;
    }

    if (location !== 'Choose a location') {
      queryParams.push(`%${location}%`);
      queryString += queryParams.length > 1
        ? `AND city LIKE $${queryParams.length}`
        : `WHERE city LIKE $${queryParams.length} `
      ;
    }

    queryParams.push(limit);
    queryString += `LIMIT $${queryParams.length};`;

    db.query(queryString, queryParams)
      .then((data: any) => {
        if (!data.rows.length) {
          res.json(['No results.']);
        } else {
          res.json(data.rows);
        }
        
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  return router;
};