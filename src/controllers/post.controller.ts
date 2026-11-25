import { Request, Response } from "express";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body as { content?: string };
  if (!content || !content.trim()) {
    res.status(400).json({ message: "Content is required" });
    return;
  }
  const post = await Post.create({ author: req.user!.id, content });
  res.status(201).json({ message: "Post created", post });
};

export const getMyPosts = async (req: Request, res: Response): Promise<void> => {
  const posts = await Post.find({ author: req.user!.id }).sort({ createdAt: -1 });
  res.json({ count: posts.length, posts });
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.postId).populate("author", "name email");
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  res.json({ post });
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
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
  if (post.author.toString() !== req.user!.id) {
    res.status(403).json({ message: "Only the post owner can update this post" });
    return;
  }
  post.content = content;
  await post.save();
  res.json({ message: "Post updated", post });
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  if (post.author.toString() !== req.user!.id) {
    res.status(403).json({ message: "Only the post owner can delete this post" });
    return;
  }
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: "Post and its comments deleted" });
};
