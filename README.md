# Welcome to Glitch

Click `Show` in the header to see your app live.
Updates to your code will instantly deploy and update live.

## Working on your project locally

To work on your project locally, `git clone` the URL under `Tools > Import and Export > Your project's Git URL`. Then, make changes, commit them, push to remote, yada yada, and repeat.

## Compiling your project

Because Glitch will convert this into a non-static site if the root has a package.json, all compiling must be done on a local computer. Use the `tsc -w` command to watch the project directory for any changes and type check your project. If the `tsc` command doesn't exist, make sure that you've installed `typescript` onto your system using `npm i -g typescript`.

In order for TypeScript to understand that you are using the `p5` library and provide documentation and error checking for general functions, install the `@types/p5` package into your project using `npm i @types/p5`.

If you use Visual Studio Code or another editor with TypeScript installed, errors in your TypeScript code will show up directly in the editor.

## Your project

### ← README.md

That's this file. You can tell people what your amazing project does here by clicking `Markdown` at the top of Glitch, then editing this file.

If you're working locally using Git, your code editor should be able to open this directly.

### ← sketch

This folder contains your sketch. In this type of project, you'll make your main script for your project in the sketch/index.ts file, which starts out with exported `setup()` and `draw()` functions.

If you need to use several files, add more .ts files and `import` them into your project.

### ← .eslintrc.json

This file helps Glitch properly check your code. You won't need to edit it.

### ← .gitignore

This file tells your computer not to send certain files to Glitch. You won't need to edit it.

### ← index.d.ts

This file helps TypeScript check your code properly. You won't need to edit it.

### ← tsconfig.json

This file helps TypeScript check you code properly. You should only edit this if you're using a different TypeScript configuration than our defaults.

### ← index.html

This is your main site page, accessible at \[project-name\].glitch.me. You won't need to edit it unless you want your project to have a different homepage.
