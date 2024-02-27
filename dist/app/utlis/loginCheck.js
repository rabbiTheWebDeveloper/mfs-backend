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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isToken = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const user_model_1 = require("../modules/User/user.model");
const agent_model_1 = require("../modules/Agent/agent.model");
const admin_model_1 = require("../modules/Admin/admin.model");
const isToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (token) {
        const user = yield user_model_1.UsersModel.findOne({ activeSessionToken: token });
        const agent = yield agent_model_1.AgentsModel.findOne({ activeSessionToken: token });
        const admin = yield admin_model_1.AdminModel.findOne({ activeSessionToken: token });
        console.log(`Agent ${agent} User ${user} Admin ${admin}`);
        if (user || agent || admin) {
            return;
        }
        else {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please login again");
        }
    }
});
exports.isToken = isToken;
