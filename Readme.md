
---

# 🚀 Learning the MERN Backend 

### 📌 Project Model Link

[Click Here](https://app.eraser.io/workspace/htnpf8BJ2g7zHKN2JQiz)

---

# 1️⃣ Initialize the Backend Project

### ✔ Start with:

```bash
npm init
```

This generates the `package.json` file, which stores project metadata and dependencies.

---

# 2️⃣ Handling Empty Folders in Git

If Git does not track an empty folder, simply add:

```
.gitkeep
```

This allows Git to include otherwise empty directories.

---

# 3️⃣ Setup `.gitignore`

You can manually create it or generate it from **gitignore.io**.

Typical Node.js `.gitignore` includes:

* `/node_modules`
* `/dist`
* `.env` files
* VSCode settings
* temp files

---

# 4️⃣ Environment Variables Setup

Install dotenv:

```bash
npm i dotenv
```

Then create `.env` for configuration (DB URI, PORT, etc.).

Add this line in **src/index.js**:

```js
import dotenv from "dotenv";
dotenv.config();
```

---

# 5️⃣ Enable ES Modules (import/export)

To use `import` instead of `require`, add this to **package.json**:

```json
"type": "module"
```

---

# 6️⃣ Development Server Setup

### Option A — Use Node’s built-in watch:

```bash
node --watch src/index.js
```

### Option B (Preferred) — Install nodemon:

```bash
npm i -D nodemon
```

Update scripts in **package.json**:

```json
"scripts": {
  "dev": "nodemon src/index.js"
}
```

Run the project:

```bash
npm run dev
```

---

# 7️⃣ Prettier Setup (Code Formatter)

Install Prettier:

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
/.vscode
/node_modules
./dist
*.env
.env
.env.*
```

Prettier ensures consistent code formatting across the project.

---

# 8️⃣ Final Folder Structure (Today’s Progress)

```
D:.
├───node_modules
│   ├───.bin
│   ├───anymatch
│   ├───balanced-match
│   │   └───.github
│   ├───binary-extensions
│   ├───brace-expansion
│   ├───braces
│   │   └───lib
│   ├───chokidar
│   │   ├───lib
│   │   └───types
│   ├───concat-map
│   │   ├───example
│   │   └───test
│   ├───debug
│   │   └───src
│   ├───dotenv
│   │   └───lib
│   ├───fill-range
│   ├───glob-parent
│   ├───has-flag
│   ├───ignore-by-default
│   ├───is-binary-path
│   ├───is-extglob
│   ├───is-glob
│   ├───is-number
│   ├───minimatch
│   ├───ms
│   ├───nodemon
│   │   ├───bin
│   │   ├───doc
│   │   │   └───cli
│   │   └───lib
│   │       ├───cli
│   │       ├───config
│   │       ├───help
│   │       ├───monitor
│   │       ├───rules
│   │       └───utils
│   ├───normalize-path
│   ├───picomatch
│   │   └───lib
│   ├───prettier
│   │   ├───bin
│   │   ├───internal
│   │   └───plugins
│   ├───pstree.remy
│   │   ├───lib
│   │   └───tests
│   │       └───fixtures
│   ├───readdirp
│   ├───semver
│   │   ├───bin
│   │   ├───classes
│   │   ├───functions
│   │   ├───internal
│   │   └───ranges
│   ├───simple-update-notifier
│   │   ├───build
│   │   └───src
│   ├───supports-color
│   ├───to-regex-range
│   ├───touch
│   │   └───bin
│   └───undefsafe
│       ├───.github
│       │   └───workflows
│       └───lib
├───public
│   └───temp
└───src
    ├───controllers
    ├───db
    ├───middlewares
    ├───models
    ├───routes
    └───utils
```

### 📂 Folder Purpose

| Folder           | Purpose                            |
| ---------------- | ---------------------------------- |
| **controllers/** | Functions handling API logic       |
| **db/**          | Database connection (MongoDB)      |
| **middlewares/** | Auth, validation, error handlers   |
| **models/**      | Mongoose schemas/models            |
| **routes/**      | API endpoints                      |
| **utils/**       | Helpers (JWT, mail, cloud uploads) |
| **public/temp/** | Temporary file storage             |

---

# ⭐ Summary — What You Learned Today

* Initialized a Node project
* Setup Git & `.gitignore`
* Created `.env` with dotenv
* Enabled ES modules
* Setup nodemon for auto-restart
* Installed & configured Prettier
* Created backend folder structure

---

