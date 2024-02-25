import ApiError from "../../errors/ApiError";
import { IAgent } from "./agent.interface";
import { AgentsModel } from "./agent.model";

export const registrationFromDB = async (data: IAgent): Promise<IAgent> => {
  try {
    const user = new AgentsModel(data);
    await user.save();

    if (!user) {
      throw new ApiError(400, 'Failed to create');
    }
    return user;
} catch (error:any) {
    if (error.code === 11000 && error.keyPattern.email === 1) {
       
        throw new ApiError( 400,'Email already exists');
    } else {
     
        throw error;
    }
}
};

export const loginFromDB = async (reqBody: IAgent): Promise<void> => {
  const user: any = await AgentsModel.aggregate([
    { $match: reqBody },
    { $project: { _id: 1, email: 1, name: 1, mobileNumber: 1 } },
  ]);
  return user;
};

export const userUpdateInDB = async (
  userId: string,
  updateData: Partial<IAgent>
): Promise<any | null> => {
  try {
    const result: any = await AgentsModel.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    return result;
  } catch (error) {
    // Handle any errors that occur during the update process.
   
    throw error; // Rethrow the error or handle it as needed.
  }
};
