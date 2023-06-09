\c biztime

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS industries_companies CASCADE;


CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  industry_code text PRIMARY KEY,
  industry_description text
);

CREATE TABLE industries_companies (
  id serial PRIMARY KEY,
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
  ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('mdm', 'MDM Consulting', 'A boring company.');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null),
         ('mdm', 300, false, null),
         ('mdm', 500, false, null);

INSERT INTO industries
  VALUES  ('tech', 'Companies specializing in computer technology'),
          ('cons', 'Consulting firms that get money for doing stuff and things'),
          ('rtl', 'Companies in retail that sell stuff'),
          ('sci', 'Companies that do research');

INSERT INTO industries_companies (comp_code, ind_code)
  VALUES  ('apple', 'tech'),
          ('ibm', 'tech'),
          ('mdm', 'cons'),
          ('mdm', 'sci'),
          ('apple', 'rtl'),
          ('apple', 'sci');