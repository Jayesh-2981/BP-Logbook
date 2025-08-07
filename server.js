const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve HTML, JS, CSS, and other static files from the whole login_form directory
app.use(express.static(path.join(__dirname, "login_form")));

// Default route → redirect to register.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login_form", "view", "register.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at: http://localhost:${PORT}`);
});
