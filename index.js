// third parties
const express = require("express");

const debug = require("debug")("app:main");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
// end of the third parties

// routes
const courses = require("./routes/courses");
const homePage = require("./routes/homepage");
// end of the routes

// my custom middlwares
const { logger, authenticating } = require("./middleware/logger");
// end of my custom middlewares
const app = express();

app.use(express.json());

app.use(logger);
app.use(authenticating);
app.use(helmet());
app.use("", homePage);
app.use("/api/courses", courses);

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail server: " + config.get("mail.host"));
console.log("Mail password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan is enabled...");
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
