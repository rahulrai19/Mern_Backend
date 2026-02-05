
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
---

# 📌 **Backend Learning Notes – 26/11/2025**

---

## 📁 **1. Today’s Learning Summary**

Today I worked on backend fundamentals including:

* File uploads using **Multer** (and checked *express-fileupload* as an alternative solution)
* Using the **fs** module for file handling
* Understanding **HTTPS requests** (learned from crash course)
* Working with **Routes and Controllers**
* API testing with **Postman**
* Improving Cloudinary upload logic
* Using **Collections** and **Environment Variables** in Postman

---

## 📤 **2. File Upload Handling (Multer)**

* Implemented file uploading using **multer**.
* Learned about:

  * `diskStorage`
  * managing file paths
  * accessing uploaded files through `req.file` / `req.files`.

### Alternative used

Checked **express-fileupload** as an easier second option (less control but simpler).

---

## 📁 **3. Using Node’s `fs` Module**

Worked with:

* `fs.existsSync()`
* `fs.unlinkSync()`
* Reading and removing temporary local upload files
* Used `fs.unlink` inside Cloudinary helper to delete local files after uploading.

---

## 🌐 **4. HTTPS Request (Crash Course Summary)**

Learned how an HTTPS request works:

* The browser/client sends a request to the server using **HTTPS**.
* HTTPS uses **TLS/SSL** to encrypt data.
* The server responds with a secure SSL certificate.
* Both sides encrypt and decrypt data using secret keys.
* Helps ensure **security**, **privacy**, and **integrity** of API calls.

*(This matches how Postman communicates with your local server when using HTTPS URLs.)*

---

## 🚏 **5. Router and Controller Structure**

Started using **MVC pattern**:

### Example Structure

```
/controllers
   └── user.controller.js

/routes
   └── user.route.js

app.js
```

### Steps Completed

* Created **user.controller.js** and added logic.
* Created **user.route.js** and defined routes.
* Imported the route into **app.js** using:

  ```js
  app.use("/api/v1/users", userRoutes);
  ```

---

## 🧪 **6. Postman Work (26/11/2025)**

Used Postman for:

### ✔ GET & POST API Testing

* Tested JSON body requests
* Tested `form-data` for file uploads

### ✔ Collections

* Created API collections for better organization

### ✔ Environment Variables

Learned to use:

* `{{base_url}}`
* `{{token}}`
* automatic variables
* switching environments (local, dev, prod)

---

## ☁️ **7. Cloudinary Logic Improvement**

Updated `cloudinary.js`:

* Removed printing URL logs
* Added auto-delete of local temporary file after upload:

  ```js
  fs.unlinkSync(localFilePath);
  ```

Cleaner upload flow → no leftover files in `/public/temp`.

---

# 🔒 **HTTPS – Simple, Clean Explanation**

HTTPS stands for **HyperText Transfer Protocol Secure**.
It is simply **HTTP + encryption**.

### ⭐ Why HTTPS Exists

Data sent over normal HTTP can be:

* Read by anyone
* Modified
* Stolen (passwords, tokens, cookies)

HTTPS fixes this by **encrypting every request and response**.

---

## 🧠 **How HTTPS Works (Very Simple Explanation)**

### 1️⃣ **Client sends a request to the server**

Example:

```
https://myapi.com/login
```

### 2️⃣ **Server sends a SSL Certificate**

This certificate contains:

* Server identity
* Public key
* Encryption information

The browser checks if the certificate is valid and trusted.

### 3️⃣ **Client creates a secret session key**

This key is used to encrypt all communication after handshake.

### 4️⃣ **Client encrypts the session key using server’s public key**

Only the server can decrypt it using its **private key**.

### 5️⃣ **Secure connection is established**

Now every request (POST, GET) looks like:

```
Encrypted → cannot be read by anyone in between
```

### ⭐ In short:

```
HTTP = normal communication  
HTTPS = same communication but encrypted and protected
```

---

# 🏛️ **MVC – Model, View, Controller**

MVC is a **software architecture pattern** that organizes code cleanly.

It separates the application into **three parts**:

```
Model → Database layer  
View → UI (frontend)  
Controller → Logic/Processing (backend)
```

Since you are doing backend (Node + Express):

* You mostly use **Model** and **Controller**
* *View* is handled by React frontend (separate)

---

## 📁 **1️⃣ Model (M)**

* Represents database structure
* Defines collections/tables
* Mongoose schema in MongoDB

Example:

```js
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});
```

The **Model** handles:

* Validations
* CRUD operations
* Database queries

---

## 🧠 **2️⃣ Controller (C)**

* Contains **logic** of the application
* Processes request → interacts with model → sends response
* Does NOT directly talk to the database; uses the Model instead

Example:

```js
export const registerUser = async (req, res) => {
  // logic   (validate, check user, call DB, send response)
};
```

---

## 🚏 **3️⃣ View (V)**

In your project:
**React / Frontend pages** act as "views".

They display data sent by the controller through API responses.

Example `useEffect` fetching posts:

```js
axios.get("/api/posts");
```

---

# ⭐ **How MVC Works Together**

When a user takes action (e.g., register):

1. **Route** receives `/register`
2. **Controller** handles validation + logic
3. **Model** saves data in MongoDB
4. **Controller** returns sanitized data
5. **View (React)** displays result

Flow diagram:

```
User → Route → Controller → Model → Controller → View
```

---

# 🎯 Why MVC Is Important

* Cleaner code
* Easy to maintain
* Easy to add new features
* Clear separation of responsibility
* Professional industry-standard structure

Most modern backend systems (Node, Django, Laravel, Rails, Spring Boot) use MVC in some form.


---

# 🔐 Authentication Flow using Access Token, Refresh Token, Cookies & Middleware

## 1️⃣ Why Access Token & Refresh Token?

### ❓ Problem

* Access Tokens are **short-lived** (e.g. 15 min)
* If they expire, user should **not login again**

### ✅ Solution

* Use **Refresh Token (long-lived)**
* When access token expires:

  * Client sends refresh token
  * Server validates it
  * Server issues **new access token**

---

## 2️⃣ Login User Flow (Step-by-Step)

### 🔁 Overall Flow

1. Take credentials from request body
2. Validate username/email
3. Find user in database
4. Verify password
5. Generate **access + refresh tokens**
6. Store refresh token in DB
7. Send tokens via **secure HTTP-only cookies**

---

## 3️⃣ `loginUser` Function – Explanation

```js
const loginUser = asyncHandler(async (req, res) => {
```

➡ Wrapped in `asyncHandler` to avoid repetitive try-catch blocks.

---

### 🔹 Step 1: Extract Credentials

```js
const { email, username, password } = req.body;
```

---

### 🔹 Step 2: Validate Input

```js
if (!username || !email) {
  throw new ApiError(400, "username or email is required");
}
```

➡ Prevents invalid login requests
➡ Uses custom error class `ApiError`

---

### 🔹 Step 3: Find User

```js
const user = await User.findOne({
  $or: [{ username }, { email }],
});
```

➡ Allows login using **username OR email**

---

### 🔹 Step 4: User Not Found

```js
if (!user) {
  throw new ApiError(404, "User not found !");
}
```

---

### 🔹 Step 5: Password Verification

```js
const isPasswordValid = await user.isPasswordCorrect(password);
```

➡ Uses **bcrypt comparison inside model method**
➡ Keeps controller clean

```js
if (!isPasswordValid) {
  throw new ApiError(401, "Invalid user credentials");
}
```

---

### 🔹 Step 6: Generate Tokens

```js
const { accessToken, refreshToken } =
  await generateAccessAndRefreshTokens(user._id);
```

**Why pass `user._id`?**

* Tokens contain user identity
* Payload is minimal (secure & lightweight)

---

### 🔹 Step 7: Remove Sensitive Fields

```js
const loggedInUser = await User.findById(user.id)
  .select("-password -refreshToken");
```

➡ Never expose password or refresh token in response

---

### 🔹 Step 8: Cookie Options

```js
const options = {
  httpOnly: true,
  secure: true,
};
```

| Option   | Purpose                             |
| -------- | ----------------------------------- |
| httpOnly | Prevents JS access (XSS protection) |
| secure   | Sent only over HTTPS                |

---

### 🔹 Step 9: Send Response

```js
return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in Successfully"
    )
  );
```

➡ Tokens stored in cookies
➡ Also returned in JSON (useful for mobile apps / testing)

---

## 4️⃣ Logout Flow

### 🔁 What Logout Does

1. Remove refresh token from database
2. Clear access & refresh token cookies

---

## 5️⃣ `logoutUser` Explanation

```js
const logoutUser = asyncHandler(async(req,res)=>{
```

---

### 🔹 Step 1: Remove Refresh Token from DB

```js
User.findByIdAndUpdate(
  req.user._id,
  {
    $set: { refreshToken: undefined }
  },
  { new: true }
)
```

➡ Even if attacker has old refresh token → it becomes invalid

---

### 🔹 Step 2: Clear Cookies

```js
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
```

➡ Removes tokens from client browser

---

### 🔹 Step 3: Response

```js
.json(new ApiResponse(200,{},"User logged Out"))
```

---

## 6️⃣ JWT Authentication Middleware

### 🔐 Purpose

* Protect private routes
* Validate access token
* Attach user info to `req.user`

---

## 7️⃣ `verifyJWT` Middleware – Explanation

```js
export const verifyJWT = asyncHandler(async(req,_,next)=>{
```

---

### 🔹 Step 1: Extract Token

```js
const token =
  req.cookies?.accessToken ||
  req.header("Authorization")?.replace("Bearer ","");
```

✔ Supports:

* Cookies (browser apps)
* Authorization header (Postman, mobile apps)

---

### 🔹 Step 2: No Token → Unauthorized

```js
if(!token){
  throw new ApiError(401,"Unauthorized request")
}
```

---

### 🔹 Step 3: Verify Token

```js
const decodedToken =
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
```

➡ Throws error automatically if:

* Token expired
* Token tampered

---

### 🔹 Step 4: Find User

```js
const user = await User.findById(decodedToken?._id)
  .select("-password -refreshToken");
```

---

### 🔹 Step 5: User Not Found

```js
if(!user){
  throw new ApiError(401,"Invalid Access Token");
}
```

---

### 🔹 Step 6: Attach User & Continue

```js
req.user = user;
next();
```

➡ Protected routes can now access `req.user`

---

## 8️⃣ Refresh Token Route

```js
router.route("/refresh-token").post(refreshAccessToken);
```

### 🔁 Refresh Token Flow

1. Client sends refresh token (cookie)
2. Server compares with DB stored token
3. If valid → issue **new access token**
4. Old access token discarded

---

## 9️⃣ Why This Architecture is Industry-Standard ✅

✔ Stateless authentication
✔ Secure cookie handling
✔ Token rotation support
✔ Scales well (no session storage)
✔ Frontend-backend decoupled

---

---

## 🗓️ `05-02-2026` Writing Update Controllers for Users | Backend with JS

### 🔔 Subscription Model

* Created a **Subscription schema** with `subscriber` and `channel` references.
* Designed to support **many-to-many relationships** between users.
* Chose a separate model for **better scalability and clean querying**.

---

### 👤 User Controllers

#### 🔐 Change Current Password

* Verifies current password using bcrypt.
* Hashes and stores the new password securely.
* Accessible only to authenticated users.

#### 📄 Get Current User Details

* Uses JWT middleware.
* Returns `req.user` without sensitive fields.
* Avoids unnecessary database queries.

#### ✏️ Update Account Details

* Updates allowed profile fields (name, email, username, etc.).
* Uses `findByIdAndUpdate` with `{ new: true }`.
* Excludes password and refresh token from response.

#### 🖼️ Update User Avatar

* Accepts image via `multipart/form-data`.
* Uploads to cloud storage.
* Stores avatar URL in user document.

#### 🖼️ Update User Cover Image

* Similar to avatar update.
* Uses separate `coverImage` field.
* Follows same validation and security rules.

---

### ✅ Key Practices

* `asyncHandler` for error handling
* Auth middleware for protection
* Secure password & media handling

---

