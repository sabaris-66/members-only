const { Router } = require("express");
const membersController = require("../controllers/membersController");
const membersRouter = Router();

membersRouter.get("/", membersController.getIndex);
membersRouter.get("/signUp", membersController.getSignUp);
membersRouter.post("/signUp", membersController.postSignUp);
membersRouter.get("/logIn", membersController.getLogIn);
membersRouter.post("/logIn", membersController.postLogIn);
membersRouter.get("/logout", membersController.getLogout);
membersRouter.get("/create", membersController.getCreate);
membersRouter.post("/create", membersController.postCreate);
membersRouter.post("/delete", membersController.postDeleteMessage);
module.exports = membersRouter;
