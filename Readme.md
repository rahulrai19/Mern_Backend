# Learning the mern backend

-[model Link](https://app.eraser.io/workspace/htnpf8BJ2g7zHKN2JQiz) 
### start with `npm init`
### if we create a folder and github is not track the file for that we add `.gitkeep` file in folder

### we will create `.gitignore` else we generate from gitignore generator

### we wil add env files`npm i dotenv`

### dont forget to add `"type":"module"` in package .json

### if we want use -- watch

### but now i am using nodemon 
```
npm i -D nodemon

```
### change the script in package.json to 
```
"dev":"nodemon src/index.js"
```
### lets install prettier `npm i -D prettier`__ `it is web dependency`

### create file `.prettierrc`
```
{
    "singleQuote":false,
    "bracketSpacing":true,
    "tabWidth":2,
    "semi":true,
    "trailingComma":"es5"
}
```
### create file `.prettierignore` we can also genrate from generators
```
/.vscode
/node_module
./dist
*.env
.env
.env.*

```
