import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";
import {
  loginFromDB,
  registrationFromDB,
  userUpdateInDB,
} from "./user.service";
import catchAsync from "../../shared/catchAsync";
import jwt from "jsonwebtoken";
export const registration: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const reqBody = req.body;
    const product = await registrationFromDB(reqBody);
    sendApiResponse(res, 200, true, product);
  }
);
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body;
    const data: any = await loginFromDB(reqBody);
    if (data?.length > 0) {
      let Payload = {
        exp: Math.floor(Date.now() / 1000) + 50 * 24 * 60 * 60,
        data: data[0]["_id"],
      };

      let token = jwt.sign(Payload, "SecretKey123456789");
      res.status(200).json({ status: "success", token: token, data: data[0] });
    } else {
      res.status(401).json({ status: "unauthorized" });
    }
    // }
  }
);

export const userUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqBody = req.body;
  const id: string = req.params.id;
  const product = await userUpdateInDB(id, reqBody);
  sendApiResponse(res, 200, true, product);
};
