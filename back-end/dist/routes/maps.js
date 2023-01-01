"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
module.exports = (db) => {
    // Get ALL maps from db:
    router.get('/map/:page', (req, res) => {
        const page = req.params.page;
        const limitPerPage = 6;
        let offset = 0;
        if (Number(page) >= 2) {
            offset = limitPerPage * (Number(page) - 1);
        }
        const queryString = `SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username AS username FROM maps
      LEFT JOIN pins ON map_id = maps.id
      JOIN users ON maps.creator = users.id
      GROUP BY maps.id, users.username
      ORDER BY maps.id DESC
      LIMIT ${limitPerPage} OFFSET ${offset};`;
        db.query(queryString)
            .then((data) => {
            //console.log('Get MAPS', data.rows);
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Route to fetch maps count to setup number of pages dynamically in the front-end:
    router.get('/maps', (req, res) => {
        const queryString = `
      SELECT COUNT(*) FROM maps;
      `;
        db.query(queryString)
            .then((data) => {
            res.json(data.rows[0]);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Get the comments of a specific map:
    router.get('/maps/:map_id/comments/:counter', (req, res) => {
        const map_id = req.params.map_id;
        const counter = req.params.counter;
        const limitPerPage = 5;
        const limit = limitPerPage * Number(counter);
        const queryParams = [map_id];
        const queryString = `SELECT map_comments.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM map_comments
      JOIN users ON map_comments.user_id = users.id
      WHERE map_comments.map_id = $1
      ORDER BY date_commented
      LIMIT ${limit};`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Route to post a comment on a map:
    router.post('/maps/:map_id/comments', (req, res) => {
        const map_id = req.params.map_id;
        const user_id = req.body.user_id;
        const content = req.body.content;
        const queryParams = [map_id, user_id, content];
        const queryString = `
      INSERT INTO map_comments (map_id, user_id, content, date_commented)
      VALUES ($1, $2, $3, Now())
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            //console.log('add comments', data.rows);
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Get the likes of a specific map:
    router.get('/maps/:map_id/likes', (req, res) => {
        const map_id = req.params.map_id;
        const queryParams = [map_id];
        const queryString = `SELECT map_likes.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM map_likes
      JOIN users ON map_likes.user_id = users.id
      WHERE map_likes.map_id = $1;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Delete a like in a specific map:
    router.delete('/maps/:map_id/likes/:user_id', (req, res) => {
        const map_id = req.params.map_id;
        const user_id = req.params.user_id;
        const queryParams = [map_id, user_id];
        const queryString = `
      DELETE FROM map_likes
      WHERE map_id = $1
      AND user_id = $2
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Add a like in a specific map:
    router.post('/maps/:map_id/likes', (req, res) => {
        const user_id = req.body.user_id;
        const map_id = req.params.map_id;
        const queryParams = [user_id, map_id];
        const queryString = `
      INSERT INTO map_likes (user_id, map_id, date_liked)
      VALUES ($1, $2, Now())
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Get coordinates from 09_coordinates.sql:
    router.get('/coordinates', (req, res) => {
        const queryString = `SELECT * FROM coordinates;`;
        db.query(queryString)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Create a new map:
    router.post('/maps/:user_id', (req, res) => {
        const creator = req.body.creator;
        const title = req.body.title;
        const city = req.body.city;
        const province = req.body.province;
        const country = req.body.country;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const queryParams = [creator, title, city, province, country, latitude, longitude];
        const queryString = `
    WITH first_insert AS (
      INSERT INTO maps (creator, date_created, title, city, province, country, latitude, longitude)
      VALUES ($1, Now(), $2, $3, $4, $5, $6, $7)
      RETURNING *
    )
    INSERT INTO contributions (user_id, map_id, date_contributed, contribution_type)
    VALUES ($1, (SELECT id FROM first_insert), Now(), 'Created Map')
    RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            console.log('weird query', data.rows);
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Add a pin in a specific map:
    router.post('/pins', (req, res) => {
        const creator = req.body.creator;
        const map_id = req.body.map_id;
        const title = req.body.title;
        const description = req.body.description;
        const image = req.body.image;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const queryParams = [creator, map_id, title, description, image, latitude, longitude];
        const queryString = `
      INSERT INTO pins (creator, map_id, date_created, title, description, image, latitude, longitude)
      VALUES ($1, $2, Now(), $3, $4, $5, $6, $7)
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Get the info of a specific map:
    router.get('/maps/:map_id', (req, res) => {
        const map_id = req.params.map_id;
        const queryParams = [map_id];
        const queryString = `SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username AS username FROM maps
    LEFT JOIN pins ON map_id = maps.id
    JOIN users ON maps.creator = users.id
    WHERE maps.id = $1
    GROUP BY maps.id, users.username
    ORDER BY maps.id DESC;`;
        ;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows[0]);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Delete a map:
    router.delete('/maps/:map_id/:user_id', (req, res) => {
        const map_id = req.params.map_id;
        const user_id = req.params.user_id;
        const queryParams = [map_id, user_id];
        const queryString = `
      DELETE FROM maps
      WHERE id = $1
      AND creator = $2
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Delete a map comment:
    router.delete('/maps/:map_id/:comment_id/:user_id', (req, res) => {
        const comment_id = req.params.comment_id;
        const user_id = req.params.user_id;
        const map_id = req.params.map_id;
        const queryParams = [comment_id, user_id, map_id];
        const queryString = `
      DELETE FROM map_comments
      WHERE id = $1
      AND user_id = $2
      AND map_id = $3
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            console.log('commet', data.rows);
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Edit a map's title:
    router.put('/maps/:map_id/:user_id', (req, res) => {
        const user_id = req.params.user_id;
        const map_id = req.params.map_id;
        const title = req.body.title;
        const queryParams = [user_id, map_id, title];
        const queryString = `
    UPDATE maps
    SET title = $3
    WHERE id = $2
    AND creator = $1
    RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Edit a map's comment:
    router.put('/maps/comments/:comment_id/:user_id', (req, res) => {
        const user_id = req.params.user_id;
        const comment_id = req.params.comment_id;
        const content = req.body.content;
        const queryParams = [user_id, comment_id, content];
        const queryString = `
    UPDATE map_comments
    SET content = $3
    WHERE id = $2
    AND user_id = $1
    RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Add contribution type when a map is created:
    router.put('/maps/contribution_type/:user_id/:map_id', (req, res) => {
        const user_id = req.params.user_id;
        const map_id = req.params.map_id;
        const contribution_type = req.body.contribution_type;
        const queryParams = [user_id, map_id, contribution_type];
        const queryString = `
      UPDATE contributions
      SET contribution_type = $3, date_contributed = Now()
      WHERE map_id = $2
      AND user_id = $1
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    return router;
};
