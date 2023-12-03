import * as dao from "./dao.js";

const setCurrentUser = async (req, userId) => {
  const currentUser = await dao.findUserById(userId);
  req.session['currentUser'] = currentUser;
};

function UserRoutes(app) {
  const handleErrors = (res, errorStatus = 500, errorMessage = 'Internal Server Error') => {
    res.status(errorStatus).json({ error: errorMessage });
  };

  const findAllUser = async (req, res) => {
    try {
      const users = await dao.findAllUsers();
      res.json(users);
    } catch (error) {
      handleErrors(res);
    }
  };

  const findUserbyId = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await dao.findUserById(id);
      res.json(user);
    } catch (error) {
      handleErrors(res);
    }
  };

  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      await dao.updateUser(userId, req.body);
      await setCurrentUser(req, userId);
      res.json({ status: true });
    } catch (error) {
      handleErrors(res);
    }
  };

  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await dao.findUserByCredentials(username, password);
      await setCurrentUser(req, currentUser.id);
      res.json(currentUser);
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };

  const signup = async (req, res) => {
    try {
      const user = await dao.findUserByUsername(req.body.username);
      if (user) {
        res.status(400).json({ message: "Username already taken" });
      } else {
        const currentUser = await dao.createUser(req.body);
        await setCurrentUser(req, currentUser.id);
        res.json(currentUser);
      }
    } catch (error) {
      handleErrors(res);
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.json(200);
  };

  const account = async (req, res) => {
    res.json(req.session['currentUser']);
  };

  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const status = await dao.deleteUser(id);
      res.json(status);
    } catch (error) {
      handleErrors(res);
    }
  };

  app.get("/api/users", findAllUser);
  app.get("/api/users/:id", findUserbyId);
  app.put("/api/users/:userId", updateUser);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signout", signout);
  app.post("/api/users/account", account);
  app.delete("/api/users/:id", deleteUser);
}

export default UserRoutes;
