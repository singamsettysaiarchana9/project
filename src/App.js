import { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    phoneNumber: "",
    dateOfJoining: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5008/employees"); // Corrected port
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Email must contain an '@' symbol.";
    }
    if (
      !formData.phoneNumber ||
      formData.phoneNumber.length !== 10 ||
      isNaN(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:5008/addEmployee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Employee added successfully!");
        fetchEmployees();
        resetForm();
      } else {
        const errorResponse = await response.json();
        alert(`Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(
        `http://localhost:5008/editEmployee/${currentEmployeeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Employee updated successfully!");
        fetchEmployees();
        resetForm();
      } else {
        const errorResponse = await response.json();
        alert(`Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      employeeId: "",
      department: "",
      phoneNumber: "",
      dateOfJoining: "",
      role: "",
    });
    setErrors({});
    setEditMode(false);
    setCurrentEmployeeId(null);
  };

  const handleEditClick = (employee) => {
    setFormData(employee);
    setEditMode(true);
    setCurrentEmployeeId(employee.employee_id);
  };

  return (
    <div
      style={{
        padding: "50px",
        display: "flex",
        justifyContent: "center",
        background: "#f9f9f9",
      }}
    >
      <div style={{ width: "500px" }}>
        <h1>Employee Management System</h1>
        <form>
          {[
            "name",
            "email",
            "employeeId",
            "department",
            "phoneNumber",
            "dateOfJoining",
            "role",
          ].map((field) => (
            <div key={field} style={{ marginBottom: "10px" }}>
              <label>{field.replace(/([A-Z])/g, " $1")}</label>
              <input
                type={field === "dateOfJoining" ? "date" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
              {errors[field] && (
                <p style={{ color: "red" }}>{errors[field]}</p>
              )}
            </div>
          ))}
          {!editMode ? (
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: "#4CAF50" }}
            >
              Submit
            </button>
          ) : (
            <>
              <button
                onClick={handleEdit}
                style={{ backgroundColor: "#008CBA" }}
              >
                Edit
              </button>
              <button
                onClick={resetForm}
                style={{ backgroundColor: "#f44336" }}
              >
                Cancel
              </button>
            </>
          )}
        </form>
        <h2>Employee List</h2>
        <ul>
          {employees.map((employee) => (
            <li key={employee.employee_id}>
              {employee.name} - {employee.role}
              <button onClick={() => handleEditClick(employee)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
