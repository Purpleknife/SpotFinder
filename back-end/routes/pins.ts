import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
const router  = express.Router();

module.exports = (db: any) => {

  // Get the likes of a specific pin:
  router.get('/pins/:pin_id/likes', (req: Request, res: Response) => {
    const pin_id: string | number = req.params.pin_id;

    const queryParams: (string | number)[] = [pin_id];
    
    const queryString: string = 
      `SELECT pin_likes.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM pin_likes
      JOIN users ON pin_likes.user_id = users.id
      WHERE pin_likes.pin_id = $1;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Delete a like in a specific pin:
  router.delete('/pins/:pin_id/likes/:user_id', (req: Request, res: Response) => {
    const pin_id: string | number = req.params.pin_id;
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [pin_id, user_id];
    
    const queryString: string = `
      DELETE FROM pin_likes
      WHERE pin_id = $1
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


  // Add a like in a specific pin:
  router.post('/pins/:pin_id/likes', (req: Request, res: Response) => {
    const user_id: string | number = req.body.user_id;
    const pin_id: string | number = req.params.pin_id;

    const queryParams: (string | number)[] = [user_id, pin_id];
    
    const queryString: string = `
      INSERT INTO pin_likes (user_id, pin_id, date_liked)
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


  // Get the comments of a specific pin:
  router.get('/pins/:pin_id/comments', (req: Request, res: Response) => {
    const pin_id: string | number = req.params.pin_id;

    const queryParams: (string | number)[] = [pin_id];
    
    const queryString: string = 
      `SELECT pin_comments.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM pin_comments
      JOIN users ON pin_comments.user_id = users.id
      WHERE pin_comments.pin_id = $1
      ORDER BY date_commented;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Route to post a comment on a pin:
  router.post('/pins/:pin_id/comments', (req: Request, res: Response) => {
    const pin_id: string | number = req.params.pin_id;
    const user_id: string | number = req.body.user_id;
    const content: string = req.body.content;

    const queryParams: (string | number)[] = [pin_id, user_id, content];
    
    const queryString: string = `
      INSERT INTO pin_comments (pin_id, user_id, content, date_commented)
      VALUES ($1, $2, $3, Now())
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



  // Delete a pin:
  router.delete('/pins/:pin_id/:user_id', (req: Request, res: Response) => {
    const pin_id: string | number = req.params.pin_id;
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [pin_id, user_id];
    
    const queryString: string = `
      DELETE FROM pins
      WHERE id = $1
      AND creator = $2
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


  // Delete a pin comment:
  router.delete('/pins/:user_id/:comment_id/:map_id', (req: Request, res: Response) => {
    const comment_id: string | number = req.params.comment_id;
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [comment_id, user_id];
    
    const queryString: string = `
      DELETE FROM pin_comments
      WHERE id = $1
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


  // Edit a pin:
  router.put('/pins/:pin_id/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;
    const pin_id: string | number = req.params.pin_id;
    const title: string = req.body.title;
    const description: string = req.body.description;
    const image: string = req.body.image;

    const queryParams: (string | number)[] = [user_id, pin_id, title, description, image];
    
    const queryString: string = `
    UPDATE pins
    SET title = $3, description = $4, image = $5
    WHERE id = $2
    AND creator = $1
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



   // Edit a pin's comment:
   router.put('/pins/comments/:comment_id/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;
    const comment_id: string | number = req.params.comment_id;
    const content: string = req.body.content;

    const queryParams: (string | number)[] = [user_id, comment_id, content];
    
    const queryString: string = `
    UPDATE pin_comments
    SET content = $3
    WHERE id = $2
    AND user_id = $1
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


  return router;
};