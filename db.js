/** Database setup for BizTime. */
const { Client } = require("pg");

let DB_URI = "postgresql:///biztime";

// I need to figure out how to do this on Mac versus WSL2

// I think this works on Mac
let db = new Client({
    // host: "/tmp",
    host: "localhost",
    database: "biztime"
  })

// and this is WSL2
// let db = new Client({
//     host: "/var/run/postgresql/",
//     database: "biztime"
//   });

db.connect();

module.exports = db;