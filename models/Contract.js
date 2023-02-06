import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ContractSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  deployedChainIds: {
    type: [String],
    required: true,
  },
});

export default mongoose.models.Contract ||
  mongoose.model("Contract", ContractSchema);
