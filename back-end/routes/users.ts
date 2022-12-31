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


  // Route to logout users:
  router.get('/logout', (req: Request, res: Response) => {
    return res.json('You\'re logged out from SpotFinder!');
  });



  // Route to load the user's info:
  router.get('/users/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [user_id];
    const queryString: string = `
      SELECT * FROM users
      WHERE id = $1;
    `;

    db.query(queryString, queryParams)
    .then((data: any) => {
      res.json(data.rows[0]);
    })
    .catch((error: Error) => {
      console.log(error.message);
    });
  });



  // Route to load the user's profile:
  router.get('/profile/:user_id/:counter', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;
    const counter: string | number = req.params.counter;
    const limitPerPage: number = 5;

    const limit: number = limitPerPage * Number(counter);

    const queryParams: (string | number)[] = [user_id];
    const queryString: string = `
      SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username, users.first_name, users.last_name, users.email, 
      users.password, users.profile_image, users.id AS user_id, users.city AS user_city, users.province AS user_province, users.country AS user_country
      FROM maps
      LEFT JOIN pins ON map_id = maps.id
      JOIN users ON maps.creator = users.id
      WHERE maps.creator = $1
      GROUP BY maps.id, users.id
      ORDER BY maps.id DESC
      LIMIT ${limit};
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


  // Edit a user's info:
  router.put('/users/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;
    const username: string = req.body.username;
    const first_name: string = req.body.first_name;
    const last_name: string = req.body.last_name;
    const city: string = req.body.city;
    const province: string = req.body.province;
    const country: string = req.body.country;
    const profile_image: string = req.body.profile_image;
      
    const queryParams: (string | number)[] = [user_id, username, first_name, last_name, city, province, country, profile_image];
    
    const queryString: string = `
    UPDATE users
    SET username = $2,
      first_name = $3,
      last_name = $4,
      city = $5,
      province = $6,
      country = $7,
      profile_image = $8
    WHERE id = $1
    RETURNING *;`
    ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        console.log('user db', data.rows);
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Route to load the user's favorite maps (maps liked):
  router.get('/favorites/:user_id/:counter', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;
    const counter: string | number = req.params.counter;
    const limitPerPage: number = 5;

    const limit: number = limitPerPage * Number(counter);

    const queryParams: (string | number)[] = [user_id];
    const queryString: string = `
      SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username, users.first_name,
        users.last_name, users.profile_image, users.id AS user_id, map_likes.date_liked, map_likes.map_id AS map_id_liked
      FROM maps
      LEFT JOIN pins ON map_id = maps.id
      JOIN users ON maps.creator = users.id
      JOIN map_likes ON users.id = map_likes.user_id
      WHERE map_likes.user_id = $1
      AND map_likes.map_id = maps.id
      GROUP BY maps.id, users.id, map_likes.date_liked, map_likes.map_id
      ORDER BY maps.id DESC
      LIMIT ${limit};
    `;

    db.query(queryString, queryParams)
    .then((data: any) => {
      res.json(data.rows);
    })
    .catch((error: Error) => {
      console.log(error.message);
    });
  });


  // Route to get maps liked count:
  router.get('/maps_liked/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [user_id];
    const queryString: string = `
      SELECT COUNT(*) FROM map_likes
      WHERE user_id = $1;
      `;

    db.query(queryString, queryParams)
      .then((data: any) => {
        res.json(data.rows[0]);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  return router;
};

