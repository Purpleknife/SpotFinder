import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
const router  = express.Router();

module.exports = (db: any) => {

  // Route to fetch ALL users:
  router.get('/users', (req: Request, res: Response) => {
    const queryString: string = `SELECT * FROM users;`;

    db.query(queryString)
      .then((data: any) => {
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });
  
  // Route to register new users:
  router.post('/users', (req: Request, res: Response) => {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password: string = req.body.password;
    const password_confirmation: string = req.body.password_confirmation;

    const queryParams: string[] = [username, email, password, password_confirmation];
    const queryString: string = `
      INSERT INTO users (username, email, password, password_confirmation)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`
    ;
    
    db.query(queryString, queryParams)      
      .then((data: any) => {
        console.log('REGISTER', data.rows);
        res.json(data.rows[0]);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Route to login users:
  router.get('/login/:id', (req: Request, res: Response) => {
    const id: string | number = req.params.id;

    const queryParams: (string | number)[] = [id];
    const queryString: string = `SELECT * FROM users WHERE users.id = $1;`;

    db.query(queryString, queryParams)      
    .then((data: any) => {
      res.json(data.rows[0]);
    })
    .catch((error: Error) => {
      console.log(error.message);
    });
  });


  // Route to load the user's profile:
  router.get('/profile/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [user_id];
    const queryString: string = `
      SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username, users.first_name, users.last_name, users.email, 
      users.password, users.profile_image, users.id AS user_id, users.city AS user_city, users.province AS user_province, users.country AS user_country
      FROM maps
      JOIN pins ON map_id = maps.id
      JOIN users ON maps.creator = users.id
      WHERE maps.creator = $1
      GROUP BY maps.id, users.id;
    `;

    db.query(queryString, queryParams)
    .then((data: any) => {
      res.json(data.rows);
    })
    .catch((error: Error) => {
      console.log(error.message);
    });
  });


  // Route to load the user's contributions:
  router.get('/contributions/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [user_id];
    const queryString: string = `
      SELECT * FROM contributions
      WHERE user_id = $1;
    `;

    db.query(queryString, queryParams)
    .then((data: any) => {
      res.json(data.rows);
    })
    .catch((error: Error) => {
      console.log(error.message);
    });
  });


  return router;
};

