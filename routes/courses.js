const express = require("express");
const router = express.Router();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
  res.send(courses);
});

router.get("/:id", (req, res) => {
  const course = courses.find((c) => {
    return c.id === parseInt(req.params.id);
  });

  if (!course)
    return res.status(404).send("The course with the given id was not found");

  res.status(200).send(course);
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

module.exports = router;
