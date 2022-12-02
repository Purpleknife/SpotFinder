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


  // Get the comments of a specific map:
  router.get('/maps/:map_id/comments', (req: Request, res: Response) => {
    const map_id: string | number = req.params.map_id;

    const queryParams: (string | number)[] = [map_id];
    
    const queryString: string = 
      `SELECT map_comments.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM map_comments
      JOIN users ON map_comments.user_id = users.id
      WHERE map_comments.map_id = $1;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Route to post a comment on a map:
  router.post('/maps/:map_id/comments', (req: Request, res: Response) => {
    const map_id: string | number = req.params.map_id;
    const user_id: string | number = req.body.user_id;
    const content: string = req.body.content;

    const queryParams: (string | number)[] = [map_id, user_id, content];
    
    const queryString: string = `
      INSERT INTO map_comments (map_id, user_id, content, date_commented)
      VALUES ($1, $2, $3, Now())
      RETURNING *;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        console.log('add comments', data.rows);
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Get the likes of a specific map:
  router.get('/maps/:map_id/likes', (req: Request, res: Response) => {
    const map_id: string | number = req.params.map_id;

    const queryParams: (string | number)[] = [map_id];
    
    const queryString: string = 
      `SELECT map_likes.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM map_likes
      JOIN users ON map_likes.user_id = users.id
      WHERE map_likes.map_id = $1;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Delete a like in a specific map:
  router.delete('/maps/:map_id/likes/:user_id', (req: Request, res: Response) => {
    const map_id: string | number = req.params.map_id;
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [map_id, user_id];
    
    const queryString: string = `
      DELETE FROM map_likes
      WHERE map_id = $1
      AND user_id = $2
      RETURNING *;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Add a like in a specific map:
  router.post('/maps/:map_id/likes', (req: Request, res: Response) => {
    const user_id: string | number = req.body.user_id;
    const map_id: string | number = req.params.map_id;

    const queryParams: (string | number)[] = [user_id, map_id];
    
    const queryString: string = `
      INSERT INTO map_likes (user_id, map_id, date_liked)
      VALUES ($1, $2, Now())
      RETURNING *;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Get coordinates from 09_coordinates.sql:
  router.get('/coordinates', (req: Request, res: Response) => {
    const queryString: string = 
      `SELECT * FROM coordinates;`;

    db.query(queryString)
      .then((data: any) => {
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });



  return router;
};
