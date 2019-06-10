import { Router } from "express";
import * as postController from "./posts";
const router: Router = Router();

router.get("/posts", postController.getPosts);
router.post("/posts", postController.registerPosts);

export default router;