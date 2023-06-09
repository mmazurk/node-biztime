const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

router.get("/", async function (req, res, next) {
  try {
    const indQuery = await db.query(
      "SELECT industry_code, industry_description FROM industries"
    );
    return res.json({ industries: indQuery.rows });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { industry_code, industry_description } = req.body;
    const results = await db.query(
      "INSERT INTO industries (industry_code, industry_description) VALUES ($1, $2) RETURNING industry_code, industry_description",
      [industry_code, industry_description]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.post("/:code", async function (req, res, next) {
  try {
    const {ind_code} = req.body;
    const {code} = req.params;
      
    // check if company exits
    const checkCompany = await db.query(
      "select * from companies where code = $1",
      [code]
    );
    if (checkCompany.rows.length === 0)
      throw new ExpressError("company doesn't exist", 404);

    // check if ind code exists
    const checkCode = await db.query(
      "select * from industries where industry_code = $1",
      [ind_code]
    );
    if (checkCode.rows.length === 0)
      throw new ExpressError("code doesn't exist", 404);

    // check of company is already associated
    const checkAssociation = await db.query(
      "select comp_code, ind_code from industries_companies where comp_code = $1",
      [code]
    );
    if (checkAssociation.rows.length > 0 && checkAssociation.rows.filter((item) => item.ind_code === ind_code).length > 0)
      throw new ExpressError("association of company and code already exists", 500);

    const results = await db.query(
      "INSERT INTO industries_companies (comp_code, ind_code) VALUES ($1, $2) RETURNING comp_code, ind_code",
      [code, ind_code]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
