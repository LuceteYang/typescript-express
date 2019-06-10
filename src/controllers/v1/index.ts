import { Router } from "express";
import * as userController from "./users";
const router: Router = Router();

router.get("/hello-world", userController.helloWorld);

router.get("/error", userController.error);

router.get("/render", userController.render);

router.post("/auth/login", userController.userLogin);

router.post("/auth/join", userController.userJoin);

router.get("/users", userController.getUser);

export default router;
