"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registration = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const agent_service_1 = require("./agent.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authController_1 = require("../../middleware/authController");
exports.registration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    if (reqBody.pin) {
        reqBody.pin = yield (0, authController_1.hashPassword)(reqBody.pin);
    }
    const product = yield (0, agent_service_1.registrationFromDB)(reqBody);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const data = yield (0, agent_service_1.loginFromDB)(reqBody);
    const _a = data._doc, { pin, approvalStatus, _id, activeSessionToken } = _a, userData = __rest(_a, ["pin", "approvalStatus", "_id", "activeSessionToken"]);
    if (activeSessionToken) {
        data.activeSessionToken = null;
        yield data.save();
    }
    const compared = yield (0, authController_1.comparePassword)(reqBody.pin, pin);
    if (compared && approvalStatus === "Approved" && data) {
        let Payload = {
            exp: Math.floor(Date.now() / 1000) + 50 * 24 * 60 * 60,
            data: _id,
        };
        let token = jsonwebtoken_1.default.sign(Payload, "SecretKey123456789");
        data.activeSessionToken = token;
        yield data.save();
        res.status(200).json({ status: "success", token: token, data: userData });
    }
    else {
        res.status(401).json({ status: "unauthorized" });
    }
    // }
}));
