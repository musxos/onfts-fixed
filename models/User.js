import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  wallet: {
    type: String,
    required: true,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
