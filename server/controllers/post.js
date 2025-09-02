import { Post } from "../models/post.js";

export const showPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        next(error);
    }
}

export const createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body);

        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        next(error);
    }
}