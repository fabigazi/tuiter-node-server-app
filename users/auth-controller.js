import * as usersDao from "./users-dao.js";
var currentUserVar;


const AuthController = (app) => {

  app.get("/api/users/new", findUsers);
  app.post("/api/users/register", register);
  app.post("/api/users/login", login);
  app.get("/api/users/profile", profile);
  app.post("/api/users/logout", logout);
  app.put("/api/users", update);
};

const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = usersDao.findUserByCredentials(username, password);
  if (user) {
    req.session["currentUser"] = user;
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const profile = async (req, res) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(404);
    return;
  }
  res.json(currentUser);
};

const register = (req, res) => {
  const username = req.body.username;
  const user = usersDao.findUserByUsername(username);
  if (user) {
    res.sendStatus(409);
    return;
  }
  req.body._id = (new Date()).getTime() + '';
  usersDao.createUser(req.body);
  const user_id = req.body._id
  req.session["currentUser"] = req.body;
  res.json(req.session["currentUser"]);
};

const logout = async (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
};

const update = (req, res) => {
  let currentUser = req.session["currentUser"];
  const updates = req.body;

  
  currentUser = { ...currentUser, ...updates };
  usersDao.updateUser(currentUser._id, currentUser)
  req.session["currentUser"] = currentUser;
  res.json(currentUser);
 };

const findUsers = (req, res) => {
  const type = req.query.type
  
  res.json(usersDao.findAllUsers())
  req.session.destroy();
}

export default AuthController;