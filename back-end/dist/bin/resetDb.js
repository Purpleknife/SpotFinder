"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const fs = __importStar(require("fs"));
const chalk = require('chalk');
const database = require('../db/connection');
// Load the schema files from db/schema:
const runSchemaFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk.cyan(`-> Loading Schema Files ...`));
    const schemaFilenames = fs.readdirSync('./db/schema');
    for (const fn of schemaFilenames) {
        const sql = fs.readFileSync(`./db/schema/${fn}`, 'utf8');
        console.log(`\t-> Running ${chalk.green(fn)}`);
        yield database.query(sql);
    }
});
// Load the seeds files from db/seeds:
const runSeedFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk.cyan(`-> Loading Seeds ...`));
    const schemaFilenames = fs.readdirSync('./db/seeds');
    for (const fn of schemaFilenames) {
        const sql = fs.readFileSync(`./db/seeds/${fn}`, 'utf8');
        console.log(`\t-> Running ${chalk.green(fn)}`);
        yield database.query(sql);
    }
});
// Reset the database:
const runResetDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        process.env.DB_HOST &&
            console.log(`-> Connecting to PG on ${process.env.DB_HOST} as ${process.env.DB_USER}...`);
        yield runSchemaFiles();
        yield runSeedFiles();
        process.exit();
    }
    catch (err) {
        console.error(chalk.red(`Failed due to error: ${err}`));
        process.exit();
    }
});
runResetDB();
