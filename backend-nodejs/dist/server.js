"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const routes_1 = __importDefault(require("./config/routes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_2 = require("./config/cors");
dotenv_1.default.config();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use((0, cookie_parser_1.default)());
// Body parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Register routes dynamically
routes_1.default.forEach(({ path, handler, middleware }) => {
    if (middleware) {
        app.use(path, middleware, handler);
    }
    else {
        app.use(path, handler);
    }
});
app.get("/", (req, res) => {
    res.json({ msg: "Hello world!" });
});
// Route not found
app.use((req, res, next) => {
    res.status(404).json({ msg: "Route not found" });
    next();
});
// error handler
app.use(errorHandler_1.default);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
