import * as usersDao from "./users-dao.js";
var currentUserVar;


const AuthController = (app) => {

  app.get("/api/users/new", findAllUsers);
  app.post("/api/users/register", register);
  app.post("/api/users/login", login);
  app.get("/api/users/profile", profile);
  app.post("/api/users/logout", logout);
  app.put("/api/users", update);
};

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const user = await usersDao.findUserByCredentials(username, password);
    if (user) {
      req.session["currentUser"] = user;
      res.json(req.session["currentUser"]);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};


const profile = (req, res) => {
  const currentUser = req.session["currentUser"];
  if (currentUser) {
    res.json(currentUser);
  } else {
    res.sendStatus(404);
  }
};

const register = async (req, res) => {
  const user = await usersDao.findUserByUsername(req.body.username);
  if (user) {
    res.sendStatus(403);
    return;
  }
  const newUser = await usersDao.createUser(req.body);
  req.session["currentUser"] = newUser;
  res.json(newUser);
};


const logout = (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
};

const update = async (req, res) => {
  let currentUser = req.session["currentUser"];
  const updates = req.body;

  const status = await usersDao.updateUser(currentUser._id, req.body);
  const user = await usersDao.findUserById(id);

  req.session["currentUser"] = user;
  res.json(status);

};

const findUsers = (req, res) => {
  const type = req.query.type

  res.json(usersDao.findAllUsers())
  req.session.destroy();
}

const findUserById = async (req, res) => {
  const id = req.params.id;
  const user = await usersDao.findUserById(id);
  res.json(user);
};


const findAllUsers = async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  if (username && password) {
    const user = await usersDao.findUserByCredentials(username, password);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  } else if (username) {
    const user = await usersDao.findUserByUsername(username);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  } else {
    const users = await usersDao.findAllUsers();
    res.json(users);
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const status = await usersDao.deleteUser(id);
  res.json(status);
};






export default AuthController;