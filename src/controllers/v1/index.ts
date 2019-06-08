import { Router } from "express";
import * as userController from "./users";
const router: Router = Router();

router.get("/hello-world", userController.helloWorld);

router.get("/error", userController.error);

router.get("/render", userController.render);


export default router;
