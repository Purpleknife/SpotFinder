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
    // Route to search for maps titles:
    router.get('/search', (req, res) => {
        const title = req.query.title;
        const location = req.query.location;
        const limit = 10;
        let queryParams = [];
        let queryString = `SELECT * FROM maps `;
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
                : `WHERE city LIKE $${queryParams.length} `;
        }
        queryParams.push(limit);
        queryString += `LIMIT $${queryParams.length};`;
        db.query(queryString, queryParams)
            .then((data) => {
            if (!data.rows.length) {
                res.json(['No results.']);
            }
            else {
                res.json(data.rows);
            }
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    return router;
};
