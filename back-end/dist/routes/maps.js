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
        const queryString = `SELECT maps.*, array_to_json(array_agg(pins)) AS pins FROM maps
      JOIN pins ON map_id = maps.id
      GROUP BY maps.id;`;
        db.query(queryString)
            .then((data) => {
            console.log('Get MAPS', data.rows);
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    // Get ALL pins for a specific map:
    router.get('/pins/:map_id', (req, res) => {
        const map_id = req.params.map_id;
        const queryParams = [map_id];
        const queryString = `
      SELECT * FROM pins
      WHERE map_id = $1;`;
        db.query(queryString, queryParams)
            .then((data) => {
            console.log('Get Pins', data.rows);
            res.json(data.rows);
        })
            .catch((error) => {
            console.log(error.message);
        });
    });
    return router;
};
