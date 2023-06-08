const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db")

router.get("/", async function (req, res, next) {
    try {
    const dbQuery = await db.query("SELECT id, comp_code from invoices");
    if (dbQuery.rows.length === 0) {
        throw new ExpressError("error: no data in database", 404)
    }
    return res.json({invoice: dbQuery.rows});
    } catch(error){
        return next(error);
    }
});

router.get("/:id", async function (req, res, next) {
    try {
    const id = req.params.id;
    const invoiceQuery = await db.query("select id, comp_code from invoices where id = $1", [id]);
    if (invoiceQuery.rows.length === 0) {
        throw new ExpressError("error: invoice id not found", 404)
    }
    const code = invoiceQuery.rows[0].comp_code;
    const companyQuery = await db.query("select code, name, description from companies where code = $1", [code]);
    if (companyQuery.rows === 0) {
        throw new ExpressError("error: company code not found", 404)
    }
    return res.json({invoice: invoiceQuery.rows, company: companyQuery.rows});
    } catch(error){
        return next(error);
    }
});

router.post("/", async function(req, res, next) {
    try {
      const {comp_code, amt} = req.body;
      const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]);
      return res.status(201).json({invoice: results.rows[0]});
    }
    catch(err) {
      return next(err);
    }
  })

  router.put("/:id", async function(req, res, next) {
    try {
      const {id} = req.params;
      const {amt, paid} = req.body;

      const paidQuery = await db.query('select paid from invoices where id = $1', [id]);
      const paidStatus = paidQuery.rows[0].paid;

      if (!paidStatus && paid) {
        paidDate = new Date();
      } else if (!paid) {
        paidDate = null
      } else {
        paidDate = currPaidDate;
      }

      const results = await db.query('UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, paid, paidDate, id]);
      if (results.rows.length === 0) {
        throw new ExpressError("Can't find invoice", 404);
      }
     
      return res.json({ invoice: results.rows[0] });
    } catch(err){
      return next(err);
    }
  }); 

  router.delete("/:id", async function(req, res, next) {
    try {
      const invoiceCode = req.params.id;
      const invoiceQuery = await db.query('DELETE FROM invoices WHERE id = $1', [invoiceCode]);
      if (invoiceQuery.rowCount !== 1) {
        throw new ExpressError(`Can't find company ${invoiceCode}`, 404);
      }
      return res.json({ status: "deleted" });
    } catch(err){
      return next(err);
    }
  });




module.exports = router;