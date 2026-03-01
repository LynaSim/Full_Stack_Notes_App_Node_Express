// Import required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");


const app = express();
const PORT = 3001;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Handle GET request at the root route - serves index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  const newData = { id: uuidv4(), ...req.body };
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});

// Handle GET request to retrieve data by ID
app.get("/data/:id", (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }
  res.json(item);
});

// TODO: Handle PUT request to update data by ID
app.put("/data/:id", (req, res) => {
  const data = readData();
  const index = data.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Data not found" });
  }

  // Update the item while preserving the original ID
  const updatedItem = { ...data[index], ...req.body, id: req.params.id };
  data[index] = updatedItem;

  writeData(data);
  res.json({ message: "Data updated successfully", data: updatedItem });
});

// Handle DELETE request to delete data by ID
app.delete("/data/:id", (req, res) => {
  const data = readData();
  const filteredData = data.filter((item) => item.id !== req.params.id);

  if (data.length === filteredData.length) {
    return res.status(404).json({ message: "Data not found" });
  }

  writeData(filteredData);
  res.json({ message: "Data deleted successfully" });
});

// 404 Middleware to handle all routes that were not defined
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});