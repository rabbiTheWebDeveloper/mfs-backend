import ApiError from "../../errors/ApiError";
import { IAdmin } from "./admin.interface";
import { AdminModel } from "./admin.model";

export const registrationFromDB = async (data: IAdmin): Promise<IAdmin> => {
  try {
    const user = new AdminModel(data);
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

export const loginFromDB = async (reqBody: IAdmin): Promise<void> => {
  const user: any = await AdminModel.aggregate([
    { $match: reqBody },
    { $project: { _id: 1, email: 1, name: 1, mobile: 1, photo: 1 } },
  ]);
  return user;
};

export const userUpdateInDB = async (
  userId: string,
  updateData: Partial<IAdmin>
): Promise<any | null> => {
  try {
    const result: any = await AdminModel.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    return result;
  } catch (error) {
    // Handle any errors that occur during the update process.
   
    throw error; // Rethrow the error or handle it as needed.
  }
};
