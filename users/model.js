import schema from "./schema.js";
import mongoose from "mongoose";

// enforce all the  restriction in scheme for users.
// this is where we can do SQL injection if needed.
const model = mongoose.model("users", schema); // user is arbitray, its needs be unique to create instance.
export default model;
