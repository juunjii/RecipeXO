import mongoose from "mongoose";

// Schema - define data structures
// model - create models based on Schema
const { Schema, model } = mongoose;

// --- User Schema ---
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: String,
    bio: String,
    favoriteRecipes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Recipe' // indicates that each ObjectId points to a document in the Recipe collection.
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Comment Schema ---
const CommentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Stores the name of the user who posted the comment (useful for querying without needing to join on the User model).
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Recipe Schema ---
const RecipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true // optimize searches by title 
    },
    description: String,
    ingredients: [
        {
            type: String,
            required: true
        }
    ],
    steps: [
        {
            type: String,
            required: true
        }
    ],
    tags: [
        {
            type: String,
            index: true
        }
    ],
    author: {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: String,
        profileImage: String
    },
    // Embedded array of comments (CommentSchema), so the latest comments are included within the recipe
    // Helps with faster reads as comments are accessed directly within the recipe document.
    comments: [CommentSchema],
    favoritesCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


// --- Indexing Strategy ---
// Speed up queries that filter by both title and tags or just title alone.
RecipeSchema.index({ title: 1, tags: 1 });
// Index on authorId to quickly find recipes by a specific user
RecipeSchema.index({ "author.authorId": 1 });

// --- Models ---
const User = model('User', UserSchema);
const Recipe = model('Recipe', RecipeSchema);
const Comment = model('Comment', CommentSchema);


// can be used in other files 
module.exports = { User, Recipe, Comment };
