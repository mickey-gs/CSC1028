# semantic

Hi! This is Semantic, a project intended to allow developers to generate source code in a variety of different programming languages with ease. This README is intended to serve as a brief introduction to the Github repo: for a complete explanation of the project, see deliverables/deliverable2.html.

## deliverables

As this is a university project, there are pieces of work that must be handed in over the course of the project. This folder holds my submitted work, including guides on programming aimed at beginners and guides to my project.

## log

This folder contains my account of the project's progress over the course of my work on it.

## src

This folder contains the source code of the project. The basic workflow of the code is to: 

take input in the form of JS code -> convert the code to AST representation -> use transpiler scripts to convert the AST back into runnable source code

So far, the features supported by this project range from variables and arithmetic up to higher order functions. The project is well past the point of being able to implement functioning programs, and I plan to soon incorporate structs to allow easier management of data. The ideal end goal of the project would be to allow a developer to specify source code once, and obtain runnable versions of that code in different languages, supporting commandline and file I/O, and hopefully up to basic GUIs using Electron.

## tests

This folder includes the tests for the project. This is designed not only as proof of the project's functionality, but as a framework for contributors to design their own transpilers against, implementing features in increasing order of complexity.
