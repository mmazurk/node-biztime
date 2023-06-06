const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError")
const db = require("../db")

router.get("/", async function(req, res, next) {
    try {
      const busQuery = await db.query("SELECT code, name, description FROM companies");
    
      // node --inspect server.js
      // debugger;
    
      return res.json({ companies: busQuery.rows });
    } catch(err){
      return next(err)
    }
  });
  
module.exports = router;