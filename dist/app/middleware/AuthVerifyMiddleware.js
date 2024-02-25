"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    let Token = req.headers['token'];
    jsonwebtoken_1.default.verify(Token, "SecretKey123456789", function (err, decoded) {
        if (err) {
            res.status(401).json({ status: "unauthorized" });
        }
        else {
            let userId = decoded['data'];
            req.headers.id = userId;
            next();
        }
    });
};
exports.auth = auth;
