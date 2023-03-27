const express = require("express");
const router = express.Router();
const path = require("path");

// the regex does the following: the user could request the root (/) or /index or /index.html all of these will be handled by this route
// we return the index.html file from the views folder
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
