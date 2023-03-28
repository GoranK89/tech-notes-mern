require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

// cors middleware to enables CORS for the REST api server (see https://www.npmjs.com/package/cors)
app.use(cors(corsOptions));

app.use(express.json());

// the cookie-parser middleware parses cookies from the request (see https://www.npmjs.com/package/cookie-parser)
app.use(cookieParser());

// With the REST api we will send and receive JSON data
// however we can still return a "splash" page for bad requests
app.use("/", express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));

// app.all("*", (req, res) => {...}): This sets up a route handler that matches all HTTP methods (GET, POST, PUT, DELETE, etc.) for the specified path.
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});

// Error logger for the MongoDB connection
mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error: ", err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostName}`,
    mongoErrLog.log
  );
});
