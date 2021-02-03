import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    updatedAt: {
        type: Date 
    },
    deletedAt: {
        type: Date
    }
},{ timestamps: true });

export const UserModel = model("user", UserSchema, "users");
