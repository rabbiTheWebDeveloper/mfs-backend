"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const dbConnection_1 = require("./app/utlis/dbConnection");
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// parse data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)());
app.use(body_parser_1.default.json());
const limiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);
// db connection
(0, dbConnection_1.dbConnection)();
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
