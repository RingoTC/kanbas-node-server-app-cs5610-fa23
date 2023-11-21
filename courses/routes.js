import Database from "../Database/index.js";

function findCourseIndexById(id) {
  return Database.courses.findIndex((course) => course._id === id);
}

function handleCourseNotFound(res) {
  res.status(404).send("Course not found");
}

function CourseRoutes(app) {
  app.get("/api/courses", (req, res) => {
    const courses = Database.courses;
    res.json(courses);
  });

  app.get("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    const courseIndex = findCourseIndexById(id);

    if (courseIndex !== -1) {
      res.json(Database.courses[courseIndex]);
    } else {
      handleCourseNotFound(res);
    }
  });

  app.delete("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    const courseIndex = findCourseIndexById(id);

    if (courseIndex !== -1) {
      Database.courses.splice(courseIndex, 1);
      res.sendStatus(204);
    } else {
      handleCourseNotFound(res);
    }
  });

  app.post("/api/courses", (req, res) => {
    const newCourse = {
      ...req.body,
      _id: new Date().getTime().toString(),
    };
    Database.courses.unshift(newCourse);
    res.json(newCourse);
  });

  app.put("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    const courseIndex = findCourseIndexById(id);

    if (courseIndex !== -1) {
      Database.courses[courseIndex] = {
        ...Database.courses[courseIndex],
        ...req.body,
      };
      res.sendStatus(200);
    } else {
      handleCourseNotFound(res);
    }
  });
}

export default CourseRoutes;
