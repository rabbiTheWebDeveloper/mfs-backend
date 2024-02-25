import ApiError from "../../errors/ApiError";
import { IUser } from "./user.interface";
import { UsersModel } from "./user.model";
import UpdateWriteOpResult  from 'mongodb';

export const registrationFromDB = async (data: IUser): Promise<IUser> => {
  try {
    const user = new UsersModel(data);
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

export const loginFromDB = async (reqBody: IUser): Promise<void> => {
  const user: any = await UsersModel.aggregate([
    { $match: reqBody },
    { $project: { _id: 1, email: 1, name: 1, mobile: 1, photo: 1 } },
  ]);
  return user;
};

export const userUpdateInDB = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<any | null> => {
  try {
    const result: any = await UsersModel.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    return result;
  } catch (error) {
    // Handle any errors that occur during the update process.
   
    throw error; // Rethrow the error or handle it as needed.
  }
};
