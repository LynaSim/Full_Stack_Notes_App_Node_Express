const express = require("express");
const app = express();
const PORT = 3001;

// Handle GET request at the root route
// Define route root in Express
app.get("/", (req, res) => {
  res.send("This is Lyna on the other side saying Hello!");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});