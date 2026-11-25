import { Router } from "express";
import { auth } from "../middleware/auth";
import { validateId } from "../middleware/validateId";
import * as comment from "../controllers/comment.controller";

const router = Router();
router.use(auth);

router.get("/:commentId", validateId("commentId"), comment.getComment);
router.patch("/:commentId", validateId("commentId"), comment.updateComment);
router.delete("/:commentId", validateId("commentId"), comment.deleteComment);

export default router;
