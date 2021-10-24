import { DataBaseServer } from './src_ts/backend/DataBaseServer';
const path = require('path');
const fs = require('fs');


var executedProgram = process.argv[1];
var dataBaseDirectory = path.dirname(executedProgram);

console.log("Directory: " + dataBaseDirectory);

const dataBaseServer = new DataBaseServer(dataBaseDirectory);


