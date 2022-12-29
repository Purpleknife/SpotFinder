import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
const router  = express.Router();

module.exports = (db: any) => {

  // Get ALL maps from db:
  router.get('/map/:page', (req: Request, res: Response) => {
    const page: string = req.params.page;
    const limitPerPage: number = 6;
    let offset: number = 0;

    if (Number(page) >= 2) {
      offset = limitPerPage * (Number(page) - 1);
    }

    const queryString: string = 
      `SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username AS username FROM maps
      LEFT JOIN pins ON map_id = maps.id
      JOIN users ON maps.creator = users.id
      GROUP BY maps.id, users.username
      ORDER BY maps.id DESC
      LIMIT ${limitPerPage} OFFSET ${offset};`
      ;


    db.query(queryString)
      .then((data: any) => {
        //console.log('Get MAPS', data.rows);
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });



  // Route to fetch maps count to setup number of pages dynamically in the front-end:
  router.get('/maps', (req: Request, res: Response) => {
    const queryString: string = `
      SELECT COUNT(*) FROM maps;
      `;

    db.query(queryString)
      .then((data: any) => {
        res.json(data.rows[0]);
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
      WHERE map_comments.map_id = $1
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
        //console.log('add comments', data.rows);
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


  // Create a new map:
  router.post('/maps/:user_id', (req: Request, res: Response) => {
    const creator: string | number = req.body.creator;
    const title: string = req.body.title;
    const city: string = req.body.city;
    const province: string = req.body.province;
    const country: string = req.body.country;
    const latitude: number = req.body.latitude;
    const longitude: number = req.body.longitude;

    const queryParams: (string | number)[] = [creator, title, city, province, country, latitude, longitude];
    
    const queryString: string = `
    WITH first_insert AS (
      INSERT INTO maps (creator, date_created, title, city, province, country, latitude, longitude)
      VALUES ($1, Now(), $2, $3, $4, $5, $6, $7)
      RETURNING *
    )
    INSERT INTO contributions (user_id, map_id, date_contributed, contribution_type)
    VALUES ($1, (SELECT id FROM first_insert), Now(), 'Created Map')
    RETURNING *;`
    ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        console.log('weird query', data.rows);
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });


  // Add a pin in a specific map:
  router.post('/pins', (req: Request, res: Response) => {
    const creator: string | number = req.body.creator;
    const map_id: string | number = req.body.map_id;
    const title: string = req.body.title;
    const description: string = req.body.description;
    const image: string = req.body.image;
    const latitude: number = req.body.latitude;
    const longitude: number = req.body.longitude;

    const queryParams: (string | number)[] = [creator, map_id, title, description, image, latitude, longitude];
    
    const queryString: string = `
      INSERT INTO pins (creator, map_id, date_created, title, description, image, latitude, longitude)
      VALUES ($1, $2, Now(), $3, $4, $5, $6, $7)
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


  // Get the info of a specific map:
  router.get('/maps/:map_id', (req: Request, res: Response) => {
    const map_id: string | number = req.params.map_id;

    const queryParams: (string | number)[] = [map_id];
    
    const queryString: string = 
    `SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username AS username FROM maps
    LEFT JOIN pins ON map_id = maps.id
    JOIN users ON maps.creator = users.id
    WHERE maps.id = $1
    GROUP BY maps.id, users.username
    ORDER BY maps.id DESC;`
    ;
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        res.json(data.rows[0]);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });



  // Delete a map:
  router.delete('/maps/:map_id/:user_id', (req: Request, res: Response) => {
    const map_id: string | number = req.params.map_id;
    const user_id: string | number = req.params.user_id;

    const queryParams: (string | number)[] = [map_id, user_id];
    
    const queryString: string = `
      DELETE FROM maps
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



  // Delete a map comment:
  router.delete('/maps/:map_id/:comment_id/:user_id', (req: Request, res: Response) => {
    const comment_id: string | number = req.params.comment_id;
    const user_id: string | number = req.params.user_id;
    const map_id: string | number = req.params.map_id;

    const queryParams: (string | number)[] = [comment_id, user_id, map_id];
    
    const queryString: string = `
      DELETE FROM map_comments
      WHERE id = $1
      AND user_id = $2
      AND map_id = $3
      RETURNING *;`
      ;

    db.query(queryString, queryParams)
      .then((data: any) => {
        console.log('commet', data.rows);
        res.json(data.rows);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  });



  // Edit a map's title:
  router.put('/maps/:map_id/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;
    const map_id: string | number = req.params.map_id;
    const title: string = req.body.title;

    const queryParams: (string | number)[] = [user_id, map_id, title];
    
    const queryString: string = `
    UPDATE maps
    SET title = $3
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


  // Edit a map's comment:
  router.put('/maps/comments/:comment_id/:user_id', (req: Request, res: Response) => {
    const user_id: string | number = req.params.user_id;
    const comment_id: string | number = req.params.comment_id;
    const content: string = req.body.content;

    const queryParams: (string | number)[] = [user_id, comment_id, content];
    
    const queryString: string = `
    UPDATE map_comments
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
