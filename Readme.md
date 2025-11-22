
---

# 🚀 **MERN Backend — Improved, Polished, Developer-Grade Notes**

---

# 1️⃣ Initialize the Backend Project

Start a new Node.js project:

```bash
npm init
```

This creates a `package.json` file, which stores:

* Project metadata
* Scripts
* Dependencies (npm modules)

---

# 2️⃣ Handling Empty Folders in Git

Git does not track empty folders.
To force Git to track a folder, create a file:

```
.gitkeep
```

This is a common practice for folders like `/public/temp/`.

---

# 3️⃣ Setup `.gitignore`

Create `.gitignore` manually or generate from:

🔗 **[https://gitignore.io](https://gitignore.io)**

Recommended entries for Node.js:

```
node_modules/
.env
.env.*
dist/
.vscode
```

---

# 4️⃣ Environment Variables with `dotenv`

Install dotenv:

```bash
npm i dotenv
```

Create `.env`:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017
CORS_ORIGIN=http://localhost:3000
```

Enable dotenv in `index.js`:

```js
import dotenv from "dotenv";
dotenv.config({ path: "./env" });
```

---

# 5️⃣ Enable ES Modules

To use `import` instead of `require`, add:

```json
"type": "module"
```

to `package.json`.

---

# 6️⃣ Development Server Setup

### ✔ Option A: Node's watch mode

```bash
node --watch src/index.js
```

### ✔ Option B: nodemon (recommended)

Install:

```bash
npm i -D nodemon
```

Add to `package.json` scripts:

```json
"scripts": {
  "dev": "nodemon src/index.js"
}
```

Run project:

```bash
npm run dev
```

---

# 7️⃣ Prettier Setup (Formatter)

Install:

```bash
npm i -D prettier
```

Create `.prettierrc`:

```json
{
  "singleQuote": false,
  "bracketSpacing": true,
  "tabWidth": 2,
  "semi": true,
  "trailingComma": "es5"
}
```

Create `.prettierignore`:

```
node_modules/
dist/
.env
.vscode/
```

---

# 8️⃣ Final Folder Structure (Good Standard Practice)

```
D:.
├── node_modules
├── public
│   └── temp
└── src
    ├── controllers
    ├── db
    ├── middlewares
    ├── models
    ├── routes
    └── utils
```

### 📂 Folder Purpose

| Folder           | Purpose                                  |
| ---------------- | ---------------------------------------- |
| **controllers/** | API logic                                |
| **db/**          | Database connection                      |
| **middlewares/** | Auth, CORS, error-handling               |
| **models/**      | Mongoose schemas                         |
| **routes/**      | API Routes                               |
| **utils/**       | Helpers (JWT, asyncHandler, cloud utils) |
| **public/temp/** | Temporary storage (uploads)              |

---

# 9️⃣ Database Connection Example (Improved)

### `src/db/index.js`

```js
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `\n🟢 MongoDB connected successfully! Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("🔴 MONGODB connection FAILED:", error);
    process.exit(1);
  }
};

export default connectDB;
```

### Importing & Running Connection

```js
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./env" });

connectDB();
```

---

# 🔟 Alternative Pattern — IIFE Based Server

```js
import express from "express";
import mongoose from "mongoose";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

    app.on("error", (error) => {
      console.log("ERROR:", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server running on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    throw error;
  }
})();
```

---

# 1️⃣1️⃣ Add Promise After DB Connection

```js
connectDB()
  .then(() => {
    console.log("DB Connected Successfully.");
  })
  .catch((err) => {
    console.log("Connection failed MongoDB!!", err);
  });
```

---

# 1️⃣2️⃣ Install CORS & cookie-parser

```js
npm i cors cookie-parser
```

Usage:

```js
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
```

---

# 1️⃣3️⃣ **Middlewares Explanation (Very Important)**

### Your middlewares:

```js
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());
```

---

## ✔ **Middleware #1 – express.json()**

### Purpose:

Parses **JSON payloads** from incoming requests.

### Example:

If frontend sends:

```json
{ "name": "Rahul" }
```

Express converts this JSON into:

```js
req.body = { name: "Rahul" }
```

### Added limit:

Prevent huge payload attacks.

---

## ✔ **Middleware #2 – express.urlencoded()**

Used for **HTML form submissions** (x-www-form-urlencoded).

`extended: true` allows nested objects.

Example:

```
name=Rahul&course[MERN]=Yes
```

→ becomes:

```js
req.body = { name: "Rahul", course: { MERN: "Yes" } }
```

---

## ✔ **Middleware #3 – express.static("public")**

Serves static files like:

* images
* PDFs
* public assets
* uploads

Example:

```
public/logo.png
```

Accessible at:

```
http://localhost:8000/logo.png
```

---

## ✔ **Middleware #4 – cookieParser()**

Parses cookies from browser → adds to `req.cookies`

Example:

A cookie:

```
token=abc123
```

becomes:

```js
req.cookies.token === "abc123"
```

Used for authentication (JWT-based login systems).

---

# 1️⃣4️⃣ **asyncHandler Utility (VERY IMPORTANT)**

Your code:

```js
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) =>
      next(err)
    );
  };
};

export { asyncHandler };
```

---

## ✔ What is asyncHandler?

⚡ **It is a Higher-Order Function (HOF)**
⚡ Wraps an async controller
⚡ Automatically handles errors
⚡ Passes errors to Express error middleware

Instead of writing:

```js
try {
  await ...
} catch(err) {
  next(err)
}
```

in every controller, asyncHandler makes it automatic.

---

## ✔ Correct Version (Fixing missing return)

```js
const asyncHandler = (requestHandler) => {
  return (req, res, next) =>
    Promise.resolve(requestHandler(req, res, next)).catch(next);
};

export { asyncHandler };
```

---

# 1️⃣5️⃣ **How Is Higher-Order Function Used Here?**

A **Higher-Order Function (HOF)** is:

▶ a function that **takes another function as an argument**, or
▶ returns another function

In this case:

```js
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {...};
};
```

* `asyncHandler` **receives a controller function**
* returns another function that wraps the original one
* adds automatic error catching

### ✔ Without HOF: messy, repeated try–catch

### ✔ With HOF: clean, reusable, professional

---

# 🎯 Example Usage of asyncHandler in Controllers

```js
import { asyncHandler } from "../utils/asyncHandler.js";

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // business logic
  const user = await User.findOne({ email });

  res.status(200).json({
    success: true,
    user,
  });
});
```

If any error occurs (DB error, missing fields, etc.):

→ asyncHandler catches it
→ Forwards to Express error middleware
→ No need for try–catch!

---

# ⭐ Final Summary (Improved)

You have learned:

✔ Project initialization
✔ ES modules setup
✔ nodemon & dotenv
✔ Project folder architecture
✔ MongoDB connection patterns
✔ CORS & cookie-parser
✔ Express middlewares
✔ asyncHandler utility
✔ Higher-order functions in backend
✔ Clean, scalable backend structure

---

---

# 🚨 **Understanding ApiError Class (Custom Error Handler)**

### 📌 Your code:

```js
class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}
```

---

# 🧠 **Explanation — Why Do We Create a Custom Error Class?**

Node.js already has a built-in `Error` class,
BUT for APIs, we need more information, such as:

* HTTP Status Code
* Error message
* Extra error details (validation errors, DB errors, etc.)
* Whether the request succeeded or failed
* Custom stack trace (useful during development)

So we extend the default Error class → **custom API errors**.

---

# 🔍 **Line-by-Line Explanation**

### ✔ `class ApiError extends Error`

You are creating a **custom error type** that inherits from JavaScript’s built-in `Error`.

This means:

* it behaves like an Error
* but contains extra fields useful for APIs

---

### ✔ `constructor(statusCode, message, errors, stack)`

The constructor accepts 4 parameters:

| Parameter    | Purpose                                     |
| ------------ | ------------------------------------------- |
| `statusCode` | HTTP code (404, 500, 401, etc.)             |
| `message`    | What went wrong                             |
| `errors`     | Extra details (array of field errors, etc.) |
| `stack`      | Custom stack trace (optional)               |

---

### ✔ `super(message)`

Calls parent (`Error`) constructor.

This sets:

```
this.message = message
this.name = "Error"
```

---

### ✔ `this.statusCode = statusCode`

Stores HTTP error code for API response.

Example:

```
throw new ApiError(404, "User not found")
```

---

### ✔ `this.data = null`

For error responses, `data` is always null (success responses use ApiResponse).

---

### ✔ `this.success = false`

Every error has `success: false`.

---

### ✔ `this.errors = errors`

Stores extra details like:

```
errors: ["email is required", "password too short"]
```

OR Joi/Yup validation errors.

---

### ✔ `Error.captureStackTrace(this, this.constructor)`

Automatically generates a clean stack trace *excluding* the constructor call.

Useful for debugging.

If a custom stack was provided, it uses that instead.

---

# 🎉 **Final Behavior**

Whenever an error occurs:

```
throw new ApiError(400, "Invalid Input", ["Email is required"])
```

Your global Express error handler can send a clean JSON response:

```json
{
  "success": false,
  "message": "Invalid Input",
  "errors": ["Email is required"]
}
```

---

# 🎁 **Improved & Polished ApiError (Production-Ready)**

Here’s a cleaner version with fixes + improvements 👇

```js
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
```

---

---

# 🟢 **Understanding ApiResponse Class**

### 📌 Your code:

```js
class ApiResponse{
    constructor(statusCode,data,message="success"){
        this.statusCode=statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}
```

---

# 🧠 **Purpose of ApiResponse**

Your APIs should always return a **consistent format**, no matter what the controller is.

This class ensures every successful response follows the same structure.

---

# 📦 **Line-by-Line Explanation**

### ✔ `constructor(statusCode, data, message = "success")`

Takes 3 values:

| Value        | Meaning                               |
| ------------ | ------------------------------------- |
| `statusCode` | HTTP code (200, 201, etc.)            |
| `data`       | Actual data (user info, tokens, etc.) |
| `message`    | Description of response               |

---

### ✔ `this.statusCode = statusCode`

Stores the HTTP status (important for front-end).

---

### ✔ `this.data = data`

Contains actual API response payload.

Example:

```js
{ name: "Rahul", email: "test@gmail.com" }
```

---

### ✔ `this.message = message`

A human-readable message like:

* "User created"
* "Login successful"
* "Fetched successfully"

---

### ✔ `this.success = statusCode < 400`

If HTTP code is less than 400 → successful (true).
Anything >= 400 is error → false.

This makes frontend API handling much easier.

---

# 🎁 **Improved Professional Version**

```js
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
```

---

# 🧿 **How They Work Together in Real API**

Example controller:

```js
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email)
    throw new ApiError(400, "Email is required", ["email missing"]);

  const user = await User.create({ email, password });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User created successfully"));
});
```

---

# 🎯 **Final Summary — Perfect for Notes**

### ✔ **ApiError**

* Custom error class for structured error responses
* Extends native JS Error
* Contains statusCode, message, errors, stack, success=false
* Used in try–catch OR inside asyncHandler

### ✔ **ApiResponse**

* Standard format for successful responses
* Contains statusCode, data, message, success=true
* Makes API responses predictable


--- Date : 20/112025
# 🚀 **MERN Backend — Mongoose Aggregation, Pagination, bcrypt & JWT**

### *(Fully Improved Developer Notes)*

---

# 1️⃣ **Created Two Schemas Today**

### ✔ `User` Model

### ✔ `Video` Model

Both models will later interact through aggregation pipelines (views, likes, comments, etc.).

---

# 2️⃣ **Learning Mongoose Aggregation Pipeline**

MongoDB provides a powerful data-processing framework called the **Aggregation Pipeline**.

Aggregation lets you:

* filter documents
* group data
* join collections (via `$lookup`)
* sort, limit, paginate
* compute statistics

### 📌 Syntax:

```js
Model.aggregate([
  { $match: { isPublished: true } },
  { $sort: { createdAt: -1 } },
  { $limit: 10 }
]);
```

---

# 3️⃣ **Installing Aggregation Pagination Plugin**

To paginate results from an aggregation pipeline, install:

```bash
npm install mongoose-aggregate-paginate-v2
```

This plugin makes aggregation results paginated like regular queries.

### Add Plugin to Schema:

```js
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

VideoSchema.plugin(mongooseAggregatePaginate);
```

### Why use it?

✔ Helps paginate complex queries
✔ Works with `$lookup`, `$group`, `$match`, `$sort`
✔ Useful for feed, videos list, search, comments, etc.

---

# 4️⃣ **Using bcrypt for Password Hashing**

Never store passwords in plain text.
Always hash passwords using bcrypt.

### Install bcrypt:

```bash
npm install bcrypt
```

### Example inside User Schema:

```js
import bcrypt from "bcrypt";

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### To verify password:

```js
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
```

---

# 5️⃣ **Using JSON Web Tokens (JWT)**

JWT is used to:

* authenticate users
* generate session tokens
* secure private routes
* maintain login state

### Install:

```bash
npm install jsonwebtoken
```

### Generate Token:

```js
import jwt from "jsonwebtoken";

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
```

### Generate Refresh Token:

```js
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
```

---

# 🎯 **Putting it Together — Final Workflow**

Here’s what you’ve achieved today:

### ✔ Created User & Video models

### ✔ Added aggregation + pagination support

### ✔ Secured passwords using bcrypt

### ✔ Implemented JWT for authentication

---

# ⭐ **Final Polished Notes Version**

Below is a **clean, corrected, deeply-explained version** of everything you wrote — including:

✔ How Mongoose pre-hooks work
✔ How JWT (sign, access/refresh tokens) works
✔ Corrected token methods
✔ Proper bcrypt usage
✔ Fixed bug in your refreshToken method (you put expiry in place of secret)
✔ Best practices
✔ Clean reusable code

This is exactly how a professional MERN backend should handle authentication.

---

# 🔵 **1. Understanding Mongoose Middleware (Pre Hooks)**

### ✔ What is `pre()` middleware (pre-hook)?

`pre()` middleware runs **before** a certain Mongoose operation.

Example:

* `pre("save")` → runs before `.save()`
* `pre("find")` → runs before any `.find()` query
* `pre("findOneAndUpdate")` → before update

**Purpose:**

* Hash passwords
* Validate data
* Timestamp updates
* Prevent unwanted modifications

---

# 🔵 **2. Your Password Hashing with Mongoose Pre Hook**

### **Correct and Professional Version**

```js
import bcrypt from "bcrypt";

userSchema.pre("save", async function (next) {
    // If the password is NOT modified, skip hashing
    if (!this.isModified("password")) return next();

    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);

    next();
});
```

### ✔ What this does?

* When you create a user → password gets hashed
* When you update something else (name/email) → password does NOT get hashed again

This prevents *double hashing*, which would break login.

---

# 🔵 **3. Password Compare Method**

```js
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
```

### ✔ What this does?

* Takes the raw password from login form
* Compares with hashed password stored in DB
* Returns `true/false`

---

# 🔵 **4. JSON Web Token (JWT) Concepts You Learned Today**

### ✔ `jwt.sign(payload, secretKey, options)`

Creates the token.

### ⭐ Access Token Purpose

* Short-lived
* Proves identity
* Used for **authorization** on protected routes

### ⭐ Refresh Token Purpose

* Long-lived
* Used to **generate new access tokens**
* Stored in secure cookies / DB

---

# 🔥 **5. Correct Access Token Method**

Your original code is good but needs clean formatting.

```js
import jwt from "jsonwebtoken";

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};
```

---

# ❌ **6. Your refresh token method has a bug**

You wrote:

```js
process.env.REFRESH_TOKEN_EXPIRY,
{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
}
```

❌ That means you used **expiry string as secret**
It should be:

✔ SECRET → REFRESH_TOKEN_SECRET
✔ EXPIRES → REFRESH_TOKEN_EXPIRY

---

# 🔥 **Correct Refresh Token Method**

```js
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};
```

### ✔ Why only `_id`?

Refresh tokens should contain:

* **Minimum data**
* Only enough to verify the session

---

# 🔵 **7. Final Clean User Model Export**

```js
export const User = mongoose.model("User", userSchema);
```

---

# 🔥 Final Polished Version of Your Entire Schema

Copy-paste this into your project:

```js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    refreshToken: {
        type: String,
    }
}, { timestamps: true });

// 🔹 HASH PASSWORD before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 🔹 CHECK PASSWORD
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// 🔹 ACCESS TOKEN
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// 🔹 REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);
```

---
## today i am using the multer for file uploadation (second option express-fileupload)
### and get into work with fs module 