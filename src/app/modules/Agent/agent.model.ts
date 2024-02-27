import { IAgent} from "./agent.interface";
import mongoose, { Schema } from "mongoose";

const agentSchema = new Schema <IAgent>({
  name: String,
  pin: String, // hashed pin
  mobileNumber: { type: String, unique: true },
  email: { type: String, unique: true },
  accountType: { type: String, default: 'Agent' },
  nid: String,
  balance: { type: Number, default: 100000 }, // Initial balance for agents
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  approvalStatus: { type: String, default: 'Pending' },
  activeSessionToken: String, // Approved, Rejected
},{
  timestamps: true,
  versionKey:false
});
export const AgentsModel=mongoose.model<IAgent>('agents',agentSchema);
