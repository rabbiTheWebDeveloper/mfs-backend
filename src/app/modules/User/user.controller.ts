import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";
import { loginFromDB, registrationFromDB } from "./user.service";
import catchAsync from "../../shared/catchAsync";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { comparePassword, hashPassword } from "../../middleware/authController";
export const registration: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    let reqBody = req.body;
    if (reqBody.pin) {
      reqBody.pin = await hashPassword(reqBody.pin);
    }
    const product = await registrationFromDB(reqBody);
    sendApiResponse(res, 200, true, product);
  }
);
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body;
    const data: any = await loginFromDB(reqBody);

    const { pin, active, _id, activeSessionToken, ...userData } = data._doc;
    if (activeSessionToken) {
      // Invalidate previous session
      data.activeSessionToken = null;
      await data.save();
    }
    const compared = await comparePassword(reqBody.pin, pin);

    if (compared && active && data) {
      let Payload = {
        exp: Math.floor(Date.now() / 1000) + 50 * 24 * 60 * 60,
        data: _id,
      };

      let token = jwt.sign(Payload, "SecretKey123456789");
      data.activeSessionToken = token;
      await data.save();
      res.status(200).json({
        status: "success",
        message: "Login successfully!",
        token: token,
        data: userData,
      });
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
    }
    // }
  }
);
