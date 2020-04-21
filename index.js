const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const { logger, authenticating } = require("./logger");
const app = express();

app.use(express.json());

app.use(logger);
app.use(authenticating);
app.use(helmet());

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail server: " + config.get("mail.host"));
console.log("Mail password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan is enabled...");
}

const port = process.env.PORT || 3000;

// database debugger.
dbDebugger("Db is now ready to accept connections...");

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => {
    return c.id === parseInt(req.params.id);
  });

  if (!course)
    return res.status(404).send("The course with the given id was not found");

  res.status(200).send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);
  if (!result) {
    return res.status(400).send("Name is required and should be min 3 chars!");
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => {
    return c.id === parseInt(req.params.id);
  });

  if (!course)
    return res.status(404).send("The course with the given id was not found");

  const result = validateCourse(req.body);
  console.log(result);
  if (!result) {
    return res.status(400).send("Name is required and should be min 3 chars!");
  }

  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => {
    return c.id === parseInt(req.params.id);
  });

  if (!course)
    return res.status(404).send("The course with the given id was not found");

  courses.splice(courses.indexOf(course), 1);
  res.send(course);
});

function validateCourse(course) {
  if (!course.name || course.name.length < 3) {
    return false;
  }
  return true;
}

app.listen(port, () => console.log(`Listening on port ${port}...`));
