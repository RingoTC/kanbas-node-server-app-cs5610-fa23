import Database from "../Database/index.js";

function findModuleIndexById(id) {
  return Database.modules.findIndex((module) => module._id === id);
}

function handleModuleNotFound(res) {
  res.status(404).send("Module not found");
}

function ModuleRoutes(app) {
  app.get("/api/modules", (req, res) => {
    const modules = Database.modules;
    res.json(modules);
  });

  app.get("/api/courses/:id/modules", (req, res) => {
    const { id } = req.params;
    const modules = Database.modules.filter((module) => module.course === id);
    res.json(modules);
  });

  app.get("/api/modules/:id", (req, res) => {
    const { id } = req.params;
    const moduleIndex = findModuleIndexById(id);

    if (moduleIndex !== -1) {
      res.json(Database.modules[moduleIndex]);
    } else {
      handleModuleNotFound(res);
    }
  });

  app.delete("/api/modules/:id", (req, res) => {
    const { id } = req.params;
    const moduleIndex = findModuleIndexById(id);

    if (moduleIndex !== -1) {
      Database.modules.splice(moduleIndex, 1);
      res.sendStatus(204);
    } else {
      handleModuleNotFound(res);
    }
  });

  app.post("/api/courses/:cid/modules", (req, res) => {
    const newModule = {
      ...req.body,
      course: req.params.cid,
      _id: new Date().getTime().toString(),
    };
    Database.modules.unshift(newModule);
    res.json(newModule);
  });

  app.put("/api/modules/:id", (req, res) => {
    const { id } = req.params;
    const moduleIndex = findModuleIndexById(id);

    if (moduleIndex !== -1) {
      Database.modules[moduleIndex] = {
        ...Database.modules[moduleIndex],
        ...req.body,
      };
      res.sendStatus(200);
    } else {
      handleModuleNotFound(res);
    }
  });
}

export default ModuleRoutes;
