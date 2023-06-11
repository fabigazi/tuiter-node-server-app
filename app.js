import express from 'express';
import HelloController from "./controllers/hello-controller.js"
import UserController from "./users/users-controller.js"

const app = express()
HelloController(app)
UserController(app)
app.listen(4000)