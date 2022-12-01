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
    router.get('/maps', (req, res) => {
        const queryString = `SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username AS username FROM maps
      JOIN pins ON map_id = maps.id
      JOIN users ON maps.creator = users.id
      GROUP BY maps.id, users.username;`;
        db.query(queryString)
            .then((data) => {
            console.log('Get MAPS', data.rows);
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Get the comments of a specific map:
    router.get('/maps/:map_id/comments', (req, res) => {
        const map_id = req.params.map_id;
        const queryParams = [map_id];
        const queryString = `SELECT map_comments.*, users.username, users.profile_image, users.first_name, users.last_name
      FROM map_comments
      JOIN users ON map_comments.user_id = users.id
      WHERE map_comments.map_id = $1;`;
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
            console.log('add comments', data.rows);
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
    return router;
};
