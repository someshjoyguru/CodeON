import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true
        }
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    coverImage: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    views: {
        type: Number,
        default: 0
    }
});

postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export const Post = mongoose.model("Post", postSchema);
