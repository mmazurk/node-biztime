const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError")
const db = require("../db")
const slugify = require("slugify")

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

  router.get("/:code", async function(req, res, next) {
    try {
      const companyCode = req.params.code;
      const busQuery = await db.query('SELECT * FROM companies WHERE code = $1', [companyCode]);
      if (busQuery.rows.length === 0) {
        throw new ExpressError(`Can't find company ${companyCode}`, 404);
      }
      const invQuery = await db.query('select * from invoices where comp_code = $1', [companyCode]);
      return res.json({ company: busQuery.rows[0], invoices: invQuery.rows });
    } catch(err){
      return next(err);
    }
  });

  router.post("/", async function(req, res, next) {
    try {
      const {name, description} = req.body;
      const code = slugify(name, "_");
      const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)RETURNING code, name, description', [code, name, description]);
      return res.status(201).json({company: results.rows[0]});
    }
    catch(err) {
      return next(err);
    }
  })

  router.put("/:code", async function(req, res, next) {
    try {
      const {code} = req.params;
      const {name, description} = req.body; 
      const results = await db.query('UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description', [name, description, code]);
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't find company ${companyCode}`, 404);
      }
      return res.json({ company: results.rows[0] });
    } catch(err){
      return next(err);
    }
  }); 

  router.delete("/:code", async function(req, res, next) {
    try {
      const companyCode = req.params.code;
      const busQuery = await db.query('DELETE FROM companies WHERE code = $1', [companyCode]);
      if (busQuery.rowCount !== 1) {
        throw new ExpressError(`Can't find company ${companyCode}`, 404);
      }
      return res.json({ status: "deleted" });
    } catch(err){
      return next(err);
    }
  });

  
module.exports = router;