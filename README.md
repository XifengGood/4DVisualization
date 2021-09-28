# Welcome to Glitch

Click `Show` in the header to see your app live.
Updates to your code will instantly deploy and update live.

## Working on your project locally

To work on your project locally, `git clone` the URL under `Tools > Import and Export > Your project's Git URL`. Then, make changes, commit them, push to remote, yada yada, and repeat.

## Compiling your project

Because Glitch will convert this into a non-static site if the root has a package.json, all compiling must be done on a local computer. Use the `tsc -w` command to watch the project directory for any changes.

In order for TypeScript to understand that you are using the `p5` library and provide documentation and error checking for general functions, install the `@types/p5` package into your project using `npm i @types/p5`.

If you use Visual Studio Code or another editor with TypeScript installed, errors in your TypeScript code will show up directly in the editor.

## Your project

### ← README.md

That's this file, where you can tell people what your cool website does and how you built it.

### ← sketch

This folder contains your sketch (aka the code that draws stuff).
This is where you'll make your script for your game.
If you need to use several files, add more .ts files and `import` them into your project.

### ← .eslintrc.json

This file helps Glitch properly check your code.
You won't need to edit it.

### ← .gitignore

This file tells your computer not to send certain files to Glitch.
You won't need to edit it.

### ← index.d.ts

This file helps VSCode's JavaScript language service check you code properly.
You won't need to edit it.

### ← tsconfig.json

This file helps VSCode's TavaScript language service check you code properly. It also gives TypeScript settings to compile your project with.
You won't need to edit it.

### ← index.html

This is your main page, accessible at \[project-name\].glitch.me.
You won't need to edit it.
