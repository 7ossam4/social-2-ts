import { Request, Response } from "express";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";

export const createComment = async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body as { content?: string };
  if (!content || !content.trim()) {
    res.status(400).json({ message: "Content is required" });
    return;
  }
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  const comment = await Comment.create({
    post: post._id,
    author: req.user!.id,
    content,
  });
  res.status(201).json({ message: "Comment added", comment });
};

export const getPostComments = async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  const comments = await Comment.find({ post: post._id })
    .sort({ createdAt: 1 })
    .populate("author", "name");
  res.json({ count: comments.length, comments });
};

export const getComment = async (req: Request, res: Response): Promise<void> => {
  const comment = await Comment.findById(req.params.commentId).populate("author", "name");
  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }
  res.json({ comment });
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body as { content?: string };
  if (!content || !content.trim()) {
    res.status(400).json({ message: "Content is required" });
    return;
  }
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }
  if (comment.author.toString() !== req.user!.id) {
    res.status(403).json({ message: "Only the comment owner can update this comment" });
    return;
  }
  comment.content = content;
  await comment.save();
  res.json({ message: "Comment updated", comment });
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  const post = await Post.findById(comment.post);
  const isCommentOwner = comment.author.toString() === req.user!.id;
  const isPostOwner = !!post && post.author.toString() === req.user!.id;

  if (!isCommentOwner && !isPostOwner) {
    res
      .status(403)
      .json({ message: "Only the comment owner or the post owner can delete this comment" });
    return;
  }
  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
};
