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
    // Route to fetch ALL users:
    router.get('/users', (req, res) => {
        const queryString = `SELECT * FROM users;`;
        db.query(queryString)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Route to register new users:
    router.post('/users', (req, res) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const password_confirmation = req.body.password_confirmation;
        const queryParams = [username, email, password, password_confirmation];
        const queryString = `
      INSERT INTO users (username, email, password, password_confirmation)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            console.log('REGISTER', data.rows);
            res.json(data.rows[0]);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Route to login users:
    router.get('/login/:id', (req, res) => {
        const id = req.params.id;
        const queryParams = [id];
        const queryString = `SELECT * FROM users WHERE users.id = $1;`;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows[0]);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Route to logout users:
    router.get('/logout', (req, res) => {
        return res.json('You\'re logged out from SpotFinder!');
    });
    // Route to load the user's info:
    router.get('/users/:user_id', (req, res) => {
        const user_id = req.params.user_id;
        const queryParams = [user_id];
        const queryString = `
      SELECT * FROM users
      WHERE id = $1;
    `;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows[0]);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Route to load the user's profile:
    router.get('/profile/:user_id', (req, res) => {
        const user_id = req.params.user_id;
        const queryParams = [user_id];
        const queryString = `
      SELECT maps.*, array_to_json(array_agg(pins)) AS pins, users.username, users.first_name, users.last_name, users.email, 
      users.password, users.profile_image, users.id AS user_id, users.city AS user_city, users.province AS user_province, users.country AS user_country
      FROM maps
      LEFT JOIN pins ON map_id = maps.id
      JOIN users ON maps.creator = users.id
      WHERE maps.creator = $1
      GROUP BY maps.id, users.id
      ORDER BY maps.id DESC;
    `;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Route to load the user's contributions:
    router.get('/contributions/:user_id', (req, res) => {
        const user_id = req.params.user_id;
        const queryParams = [user_id];
        const queryString = `
      SELECT * FROM contributions
      WHERE user_id = $1;
    `;
        db.query(queryString, queryParams)
            .then((data) => {
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Edit a user's info:
    router.put('/users/:user_id', (req, res) => {
        const user_id = req.params.user_id;
        const username = req.body.username;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const city = req.body.city;
        const province = req.body.province;
        const country = req.body.country;
        const profile_image = req.body.profile_image;
        const queryParams = [user_id, username, first_name, last_name, city, province, country, profile_image];
        const queryString = `
    UPDATE users
    SET username = $2,
      first_name = $3,
      last_name = $4,
      city = $5,
      province = $6,
      country = $7,
      profile_image = $8
    WHERE id = $1
    RETURNING *;`;
        db.query(queryString, queryParams)
            .then((data) => {
            console.log('user db', data.rows);
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    return router;
};
