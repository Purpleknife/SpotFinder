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
    // Get the likes of a specific pin:
    router.get('/pins/:pin_id/likes', (req, res) => {
        const pin_id = req.params.pin_id;
        const queryParams = [pin_id];
        const queryString = `SELECT pin_likes.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM pin_likes
      JOIN users ON pin_likes.user_id = users.id
      WHERE pin_likes.pin_id = $1;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Delete a like in a specific pin:
    router.delete('/pins/:pin_id/likes/:user_id', (req, res) => {
        const pin_id = req.params.pin_id;
        const user_id = req.params.user_id;
        const queryParams = [pin_id, user_id];
        const queryString = `
      DELETE FROM pin_likes
      WHERE pin_id = $1
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
    // Add a like in a specific pin:
    router.post('/pins/:pin_id/likes', (req, res) => {
        const user_id = req.body.user_id;
        const pin_id = req.params.pin_id;
        const queryParams = [user_id, pin_id];
        const queryString = `
      INSERT INTO pin_likes (user_id, pin_id, date_liked)
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
    // Get the comments of a specific pin:
    router.get('/pins/:pin_id/comments', (req, res) => {
        const pin_id = req.params.pin_id;
        const queryParams = [pin_id];
        const queryString = `SELECT pin_comments.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM pin_comments
      JOIN users ON pin_comments.user_id = users.id
      WHERE pin_comments.pin_id = $1;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Route to post a comment on a pin:
    router.post('/pins/:pin_id/comments', (req, res) => {
        const pin_id = req.params.pin_id;
        const user_id = req.body.user_id;
        const content = req.body.content;
        const queryParams = [pin_id, user_id, content];
        const queryString = `
      INSERT INTO pin_comments (pin_id, user_id, content, date_commented)
      VALUES ($1, $2, $3, Now())
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Delete a pin:
    router.delete('/pins/:pin_id/:user_id', (req, res) => {
        const pin_id = req.params.pin_id;
        const user_id = req.params.user_id;
        const queryParams = [pin_id, user_id];
        const queryString = `
      DELETE FROM pins
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
    // Delete a pin comment:
    router.delete('/pins/:user_id/:comment_id/:map_id', (req, res) => {
        const comment_id = req.params.comment_id;
        const user_id = req.params.user_id;
        const queryParams = [comment_id, user_id];
        const queryString = `
      DELETE FROM pin_comments
      WHERE id = $1
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
    // Edit a pin:
    router.put('/pins/:pin_id/:user_id', (req, res) => {
        const user_id = req.params.user_id;
        const pin_id = req.params.pin_id;
        const title = req.body.title;
        const description = req.body.description;
        const image = req.body.image;
        const queryParams = [user_id, pin_id, title, description, image];
        const queryString = `
    UPDATE pins
    SET title = $3, description = $4, image = $5
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
    return router;
};
