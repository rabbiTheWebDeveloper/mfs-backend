import { Request, RequestHandler, Response } from "express";
import { Transactionservice } from "./transaction.service";
import catchAsync from "../../shared/catchAsync";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { ITransaction } from "./transaction.interface";
import { bookFilterableFields, bookSearchableFields } from "./transaction.constants";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  // const user = req.headers.id;
  // payload.userId = user;
  const result = await Transactionservice.sentMoneyInsertIntoDB(payload.senderId, payload.receiverId, payload.amount);
  sendReponse<ITransaction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book created successfully!",
    data: result,
  });
});






export const TransactionController = {
  insertIntoDB,

};
