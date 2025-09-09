"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const village_routes_1 = __importDefault(require("./src/routes/village.routes"));
const thread_routes_1 = __importDefault(require("./src/routes/thread.routes"));
const reply_routes_1 = __importDefault(require("./src/routes/reply.routes"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// CORS configuration: allow production domains and handle preflight requests
const whitelist = [
    "https://farandulacordobesa.com.ar",
    "https://www.farandulacordobesa.com.ar",
    //"http://localhost:5173",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow requests with no origin (e.g. mobile apps, Postman)
        if (!origin)
            return callback(null, true);
        if (whitelist.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
}));
// Handle preflight OPTIONS requests
app.options(/.*/, (0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("CORS preflight: Origin not allowed"));
    },
    credentials: true,
}));
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
});
app.use("/villages", village_routes_1.default);
app.use("/threads", thread_routes_1.default);
app.use("/replies", reply_routes_1.default);
app.use("/users", user_routes_1.default);
app.use("/auth", auth_routes_1.default);
// For Vercel deployment - export the app
exports.default = app;
// For local development - start server if not in production
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
