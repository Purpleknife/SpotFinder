require('dotenv').config();

import * as fs from 'fs';
const chalk = require('chalk');
const database = require('../db/connection');


// Load the schema files from db/schema:
const runSchemaFiles = async () => {
  console.log(chalk.cyan(`-> Loading Schema Files ...`));
  const schemaFilenames = fs.readdirSync('./db/schema');
  
  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/schema/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await database.query(sql);
  }
};


// Load the seeds files from db/seeds:
const runSeedFiles = async () => {
  console.log(chalk.cyan(`-> Loading Seeds ...`));
  const schemaFilenames = fs.readdirSync('./db/seeds');

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/seeds/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await database.query(sql);
  }
};


// Reset the database:
const runResetDB = async () => {
  try {
    process.env.DB_HOST &&
      console.log(`-> Connecting to PG on ${process.env.DB_HOST} as ${process.env.DB_USER}...`);

    await runSchemaFiles();
    await runSeedFiles();
    process.exit();
  } catch (err) {
    console.error(chalk.red(`Failed due to error: ${err}`));
    process.exit();
  }
};

runResetDB();