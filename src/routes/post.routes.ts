import { Router } from "express";
import { auth } from "../middleware/auth";
import { validateId } from "../middleware/validateId";
import * as post from "../controllers/post.controller";
import * as comment from "../controllers/comment.controller";

const router = Router();
router.use(auth);

router.post("/", post.createPost);
router.get("/", post.getMyPosts);
router.get("/:postId", validateId("postId"), post.getPost);
router.patch("/:postId", validateId("postId"), post.updatePost);
router.delete("/:postId", validateId("postId"), post.deletePost);

router.post("/:postId/comments", validateId("postId"), comment.createComment);
router.get("/:postId/comments", validateId("postId"), comment.getPostComments);

export default router;
