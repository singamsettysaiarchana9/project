const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5008; // Corrected port to match front-end

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Archana@123", // Replace with your password
  database: "employee",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL database!");
});

// Add Employee
app.post("/addEmployee", (req, res) => {
  const {
    name,
    email,
    employeeId,
    department,
    phoneNumber,
    dateOfJoining,
    role,
  } = req.body;

  const sql = `
    INSERT INTO employeestable 
    (employee_id, name, email, phone_number, department, date_of_joining, role) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [employeeId, name, email, phoneNumber, department, dateOfJoining, role],
    (err) => {
      if (err) {
        return res.status(500).json({ message: `Database error: ${err.message}` });
      }
      res.status(200).json({ message: "Employee added successfully!" });
    }
  );
});

// Edit Employee
app.put("/editEmployee/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  const { name, email, department, phoneNumber, dateOfJoining, role } = req.body;

  const sql = `
    UPDATE employeestable 
    SET name = ?, email = ?, phone_number = ?, department = ?, date_of_joining = ?, role = ? 
    WHERE employee_id = ?
  `;

  db.query(
    sql,
    [name, email, phoneNumber, department, dateOfJoining, role, employeeId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: `Database error: ${err.message}` });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found!" });
      }
      res.status(200).json({ message: "Employee updated successfully!" });
    }
  );
});

// Get All Employees
app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employeestable";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: `Database error: ${err.message}` });
    }
    res.status(200).json(results);
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
