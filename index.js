require("dotenv").config();
const express = require("express"),
  cors = require("cors"),
  jobRouter = require("./src/api/job/job.routes.js"),
  userRouter = require("./src/api/user/user.routes.js"),
  adminRouter = require("./src/api/admin/admin.routes.js"),
  errors = require("./config/errors.js"),
  redisMiddleware = require("./src/middlewares/cache.middleware.js"),
  auth = require("./src/middlewares/auth.middleware.js");

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
require("./config/db.js");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ==== Server status API ==== //
app.get("/api", (req, res) => {
  res.send("Server is running ...!");
});

// ==== CORS Policy ==== //
var whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://small-scale-app-fe.vercel.app/",
];

var corsOptions = {
  origin: function (origin, callback) {
    if (origin === undefined) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ==== Private Routes ==== //
app.use("*", auth);

// ==== Defining Routes ==== //
app.use("/api", jobRouter);
app.use("/api", redisMiddleware, userRouter);
app.use("/api/admin", adminRouter);

// ==== Error Handeling ==== //
app.use((err, req, res, next) => {
  console.log("error ----->>>>", req.originalUrl);
  console.log("error ----->>>>", err);

  if (err.code && typeof err.code === "number") {
    res.status(err.status || 403);
    return res.json({
      success: 0,
      message: errors[err.code],
      response: err.message,
      data: {},
    });
  }

  return res.status(err.status || 500).json({
    success: 0,
    message: err.message,
    data: {},
  });
});

// ==== Start Server on PORT 5000 ==== //
const server = app.listen(PORT, () =>
  console.log(`Server Started on PORT => ${PORT}`)
);

module.exports = app;
