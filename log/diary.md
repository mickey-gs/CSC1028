<<<<<<< HEAD
### Tuesday, January 11th, 2022
=======
###Tuesday, January 11th, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Just started CSC1028! Nearly didn't make it- the Undergraduate Office Supervisor sent me an email about what module I wanted to drop for this one, and I didn't see it until it was very nearly too late- thankfully she sent a followup email, which I did see. 
I felt very excited to start this module. I had completed some projects myself before starting university (which is how I got into programming and CS in the first place), and was a little disappointed in the pacing of the first term- I found the Architecture and Networks module, as well as the maths module to be quite interesting, but I was a little disappointed with the standard of the coursework for the OOP module. It was more about implementing the theoretical concepts of OOP than problem solving skills, which is perfectly understandable- it was a module for teaching a theoretical model of software- but that doesn't make it enjoyable to actually sit down and do.
So when the opportunity arose to work on a project for 6 months with no theory or exams, I grabbed it with both hands.
I also managed to secure my first choice for a project! This is a program that enables another program to be converted to an abstract form (known as an 'abstract syntax tree', or AST), and from there into a different programming language. This picks up on something that greatly interested me from the first term, but was only mentioned in passing. During the architecture section of the A&N module, it was mentioned that a compiler converts a program to 'intermediate representation' (IR) in order to apply optimisations to it, before converting it into assembly and then into binary. It was also mentioned that many different programming languages can use compilers that only have to handle conversion to IR- from there, the same toolchain can be used to generate the final executable. This interested me because it demonstrated that all programming languages were essentially so much window dressing- that they were all fundamentally the same, and code written in many different languages could be boiled down into the same form, and made equivalent to each other. This also helps remove some of the mysticism from programming languages- they are less arts to be learned, and more tools to be used. This is very reassuring to the beginner, as it can at times seem that the greatest obstacle in software development is the vast array of languages to choose from and dedicate time to learning, when in practice the language chosen for a new project is usually of not much consequence other than what the developer prefers and what libraries they need.
But that's enough background. I got started on the project today by installing npm, nvm (version manager for npm), and acorn, a utility that allows for the conversion of javascript scripts into AST format (represented as a JSON object). Despite using Javascript before, I had forgotten most of what I knew about it, and spent the majority of the time just trying to remember how to do File I/O and run scripts from the command line. Eventually, however, I did manage to produce the beginnings of the project- a small script that can convert a JS script (given as an argument on the command line) into AST, and store that AST in a .json file. The major challenge of the project will be converting AST objects back into source code. I would guess that maybe different languages can be described by JSON files? So adding a new language as a possible output would only require supplying a new JSON file linking each AST identifier to keyword(s) in that programming language. But I am sad to say that I do not think it will be that simple.
John made a big point in the lecture today (the first and only lecture!) that we should focus on making something other people can use. I think this is a good outlook- knowing that what you're working on can help other people is a great motivational tool. I think a good goal for this project would be to create the framework for converting one language to another, and make it as easy as possible for other people to adapt this and add functionality for other languages to be converted to and from. An immediate problem that springs to mind is external libraries and language-specific features, but I'll wait until my first meeting with John before I worry about that.

<<<<<<< HEAD
### Wednesday, January 19th, 2022
=======
###Wednesday, January 19th, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Sat down to do some research for the project. I figured that if a library already exists for converting JavaScript to AST, then one must exist for converting AST to JavaScript. Luckily, it does!
Babel is a JavaScript library created with the purpose of 'compiling' code in newer versions of JavaScipt into older, more widely compatible versions. It also has a 'generator' which can act as a standalone converter for AST to JSON. 
(this is because the library internally does: modern JS -> AST -> older JS)
I figure that this would be a good resource, not to necessarily incorporate directly into my project, but as a reference for creating a general purpose parser for AST. I'll bring this up in the meeting.

Just had the first meeting! Discussed the immediate future of the project- I explained how Babel already exists, and the features it provides.
John agrees that it's a good resource, but thinks I should take the project in a direction that's very slightly different to what I was thinking. I was planning to implement the parser for one language completely, then move on to another; John suggested doing incremental steps in lots of languages at the same time. This is probably a better approach- it would save me the stress of creating an entire parser as the first step of my project. 
The eventual idea- the valuable end product to create- would be a tool that enables useful libraries to be ported from one language to another. I can imagine this not being too difficult for mathematical libraries (cryptography, geometric functions), but not sure yet how this will work for libraries that rely heavily on system calls, like networking and GUI libraries. I'll have to look into if it's possible to define how different languages handle system calls in a portable way (possibly JSON). 
This will all come later, though. First, I'll focus on trying to convert basic programs (hello world, arithmetic) into different languages.
I'm also thinking about creating the first deiverable, the online guide on something to do with my project. I haven't ran into any specific problems with getting my project up and running, so that seems like a non-starter. John suggested something to do with the first stage of my project, which would be less of a how-to guide, and more of an informative piece on hello world programs, and how they're written in a variety of programs. This sounds promising, because it might make a good comparative piece on language design as well as being able to show off what work I've completed so far. 
I'll make a start on that work now and see how it goes.

<<<<<<< HEAD
### Friday, January 21st, 2022
=======
###Friday, January 21st, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Just started work on a parser for converting AST back into code. So far, I have a parser specific to JavaScript that can handle simple method calls and arithmetic (which also preserves brackets and order of operations). Was a bit hesitant to start as I expected this to be really quite difficult, but so far not too many problems have come up. The next step is to begin work on a more general parser- my target is to be able to convert to Python and Ruby at each step of the parser's implementation. I chose these languages in particular due to:
1. My familiarity with them (easy to quickly validate the output of my program)
2. Their similarities with JavaScript- both support OOP and are both interpreted and dynamically typed
I'll take a look at how Babel structures the code for its more complex parser, and then start adding on to mine.

<<<<<<< HEAD
### Sunday, January 23rd, 2022
=======
###Sunday, January 23rd, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Made some good progress with the parser. I've brought it over from a basic set of functions global to the script to an organised super class (Parser), with sub classes started for JavaScript and Python. This means that I can override methods when language differences need to be taken into account (e.g. syntax for delcaring a function, ending lines with semicolons), but share methods for common functionality, like arithmetical expressions.
Quite happy with this approach, and how quickly I managed to implement it, so it looks like last term's OOP class has ended up being very heplful. 
The next step for the parser will be more complicated language features (such as functions, classes, etc), and adding in indentation (which is needed for Python to even run a script).

It's towards the end of the day now, and I've added function declarations and calls and variable declarations. It was tricky to deal with the buffer system I used for the parsers, where code was just added to a string, so I've also created a Buffer class. This makes it easier to deal with indentation, and makes interaction with the text buffer generally a lot cleaner. I've also updated the main script to produce output in both JS and Python automatically.

<<<<<<< HEAD
### Monday, 24th January, 2022

More work done with the parser- if, else if, else, and while statements. I've also decided that while most work in converting AST to a specific language can be done by the parser itself, a post-processor would be useful for converting some awkward key-words: for example, Python converts "else if" into one keyword ("elif") and it's simply easier to have the post-processor replace all instances of one with the other than try to modify the parser too heavily. I'll work on some more features for the parser to take care of, and then start looking at the first deliverable.

### Wednesday, 26th January, 2022
=======
###Monday, 24th January, 2022

More work done with the parser- if, else if, else, and while statements. I've also decided that while most work in converting AST to a specific language can be done by the parser itself, a post-processor would be useful for converting some awkward key-words: for example, Python converts "else if" into one keyword ("elif") and it's simply easier to have the post-processor replace all instances of one with the other than try to modify the parser too heavily. I'll work on some more features for the parser to take care of, and then start looking at the first deliverable.

###Wednesday, 26th January, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Just out of another meeting with John. He's suggested an adjustment to the project's scope; originally, I was planning on a translator that could convert programs between a bunch of different languages, but John has suggested that I try to create a program where someone can make a basic specification of a program and the functionality they want it to have, and source code in their destination language would then be generated. I think that both of these sound interesting, but for now I'm going to focus on working towards the first deliverable. 
Before the meeting, I was pretty unsure on what to do for it- I haven't had any difficulty getting my project set up, so there would be no use to creating a how-to guide. I was then thinking about the earlier suggestion of comparing "hello, world" programs in different languages, but I found it difficult to think of anything useful I could write on that. I asked John about this during the meeting, and he suggested that an interesting topic to write about would be language-agnostic programming. Basically, this would be writing an article in advocacy of writing code in non-idiomatic ways when possible. This would both help to avoid being stuck with a program that's very difficult to port to another language, and enable the programmer to write code that would be very easily understandable to other developers from diverse backgrounds. This sounds very interesting, so I'm going to start planning an article around that.

<<<<<<< HEAD
### Sunday, 30th January, 2022

Just finished writing up my plan for the article. I've decided to compare the advantages and disadvantages of writing code in an idiomatic style, and of using lots of abstractions in program-writing. I think that this could be an interesting read. In my plan, the article isn't necessarily aimed at either beginners or advanced programmers- it is aimed at anyone with an understanding of how to program, and who will know enough to have run into scenarios where they have used programming abstractions. It will try to persuade the reader not necessarily of fundamentally changing how they write programs, but in how they *approach* writing programs, and to try and consider the future of their project when they are starting out. 

### Monday, 31st January, 2022
=======
###Sunday, 30th January, 2022

Just finished writing up my plan for the article. I've decided to compare the advantages and disadvantages of writing code in an idiomatic style, and of using lots of abstractions in program-writing. I think that this could be an interesting read. In my plan, the article isn't necessarily aimed at either beginners or advanced programmers- it is aimed at anyone with an understanding of how to program, and who will know enough to have run into scenarios where they have used programming abstractions. It will try to persuade the reader not necessarily of fundamentally changing how they write programs, but in how they *approach* writing programs, and to try and consider the future of their project when they are starting out. 

###Monday, 31st January, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Finished writing the article, based on the plan I wrote yesterday. I've tried to be very balanced in my writing, and not advocate too hard for either side of the issue. I'm not trying to convince the audience that idiomatic code is always a bad ideal to strive for, or that all code should be ugly and abstractionless. I'm just trying to encourage the reader to put some planning into their projects with regards to how much technical debt they should be taking on by writing their code in an abstract, language-dependent way, and to consider if they might have to switch up what technology they're using in the future. I've added that focusing too much on writing idiomatic code can actually be very distracting from the much more important goal of writing code that progresses their work, as well as a section on how abstractions can also be very useful in programming (for balance). The article concludes by saying that, as with all tools, it is more important to know when to use abstraction than how to use it. This is the main point of the article- encouraging thoughtfulness about how a program should be written.
I've also done the markup and styling for the article, and I'm fairly proud of how it looks. I'll show the article to John during the meeting on Wednesday and see if I need to make any adjustments before handing it in.

<<<<<<< HEAD
### Wednesday, 2nd February, 2022
=======
###Wednesday, 2nd February, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

John seems happy with the article, which is good- I have no idea what I would have written about if he thought I should change subject. He emphasised that my diary is very important to the marking for the first deliverable, so I've gone over what I've written and tried to clearly explain why I wrote what I wrote, its goals and its audience. 
He says that after handing in this deliverable, the next week should be spent on planning- tidying up code I've already written, looking at the next deliverables, and planning the project's direction. I'm feeling pretty confident at this point. I was initally very worried about the article, but I think I've managed to produce something of use, and justified it fairly well. I'm also looking forward to spending a week just getting to think about what I want to do, and doing some maintenance tasks. 

<<<<<<< HEAD
### Sunday, 6th February, 2022

Did some general tidying of the source code today- splitting it up into different directories for source code, deliverables, the diary, etc. I also checked out the communities John mentioned in our last meeting, in order to get their vibe and get an idea of the form my next deliverable should take. I think the presentation of my work in each should likely be very different, as LessWrong seems more focused on self-improvement and -reflection, and HackerNews seems to me more like old Reddit. Speaking of, Reddit might end up being a good place to share my work to, which would suit me well as I am already familiar with the community.

### Monday, 7th February, 2022

I've done some thinking and planning about the project. I think a good goal for this week would be to explore using file systems across languages, and try to implement basic file I/O. This would run into having to handle imports in different languages, which would be interesting and probably make up a lot of the complexity. I also think I would like to take a look at Electron- both due to its importance to the project and because I really like making visual applications. This would give me some insight into whether it's feasible to have an embedded Electron frontend and generate back-end source code in different languages to control the program's visual output. This should also help me determine what the feasible scope of my project is going to be, in terms of how diverse of a functionality I can implement across different languages.

### Wednesday, 9th February, 2022
=======
###Sunday, 6th February, 2022

Did some general tidying of the source code today- splitting it up into different directories for source code, deliverables, the diary, etc. I also checked out the communities John mentioned in our last meeting, in order to get their vibe and get an idea of the form my next deliverable should take. I think the presentation of my work in each should likely be very different, as LessWrong seems more focused on self-improvement and -reflection, and HackerNews seems to me more like old Reddit. Speaking of, Reddit might end up being a good place to share my work to, which would suit me well as I am already familiar with the community.

###Monday, 7th February, 2022

I've done some thinking and planning about the project. I think a good goal for this week would be to explore using file systems across languages, and try to implement basic file I/O. This would run into having to handle imports in different languages, which would be interesting and probably make up a lot of the complexity. I also think I would like to take a look at Electron- both due to its importance to the project and because I really like making visual applications. This would give me some insight into whether it's feasible to have an embedded Electron frontend and generate back-end source code in different languages to control the program's visual output. This should also help me determine what the feasible scope of my project is going to be, in terms of how diverse of a functionality I can implement across different languages.

###Wednesday, 9th February, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Woke up early this morning to do some extra work before the meeting. I created a transpiler for Ruby, got it up to date with the other two transpilers, discovered and fixed a few bugs with the others (parameter lists not being written properly, if statements not being formatted with brackets in JS, etc). I also learned how to use regexes in JS; the Python transpiler needed to have expressions of the form 'array.length' transformed to 'len(array)', and I figured it was probably pretty straightforward to use regexes for this (it was).
I think that with adding array support that this should be very close to being 'good enough' to write across different programming languages. The one thing I would like to add support for is structs, because I think that should bring my program pretty close to the functionality of C- a language used for 'real work' all the time. 

I saw my mark for deliverable 1 a short while before joining the meeting. I'm disappointed, but I can understand why it was marked the way it was. I did feel very unsure about what direction I would take with it, and didn't pay enough attention to the assessment criteria, so I can see where the mark came from. I think that for the second deliverable I would be more likely to rewrite the first deliverable completely before building anything on top of it. I would refocus to be more instructive- *how* to write programs simply, not just a piece looking at the upsides and downsides of doing so. At least I know how to approach the next deliverables, and should be able to do better in them.

<<<<<<< HEAD
### Sunday, 13th February 2022
=======
###Sunday, 13th February 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Because I'll end up having to largely rewrite deliverable 1 (both to build on it for deliverable 2 and because I'm not happy with the standard of it, if my work is going to be public), I researched what other people had already contributed to the topic of writing portable code. Most resources seem to be focused on code portable between different platforms:
https://medium.com/trueface-ai/how-to-design-a-language-agnostic-cross-platform-computer-vision-sdk-e437ecac8b4e (about writing an SDK that works across different architectures)
https://pontus.digipen.edu/~mmead/www/docs/WritingPortableCode.pdf (extremely in-depth look at writing code across platforms and compilers. Particular to C, C++, and game development, with a look at Java at the end)
These articles aren't about exactly the same topic as what I'm writing about, but there is still some valuable information in both. The Medium article is a great look at how to package software libraries, which will come in handy later in the project, and both give advice on how to separate platform-specific code from the general program logic, which is demonstrative on how I should be structuring my own program to generate code.
The best resource by far that I found on language agnosticism is this one:
https://github.com/mankenavenkatesh/Language-Agnosticism
A Github repo that aggregates other resources, and is designed to teach language agnosticism. I'll likely be basing my deliverable on some of the content from there, and trying to condense it into a more approachable article than a full course of content.
I'll spend up until the meeting this week planning what I want to write my deliverable to say, and then do the actual rewriting the next week, at the same time as starting to look at the next deliverable.

<<<<<<< HEAD
### Monday, 14th February, 2022
=======
###Monday, 14th February, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Decided to do some work with the transpilers today. I've looked into it, and libraries exist for converting Python into and out of AST, and for at least converting Ruby into AST (not sure if it can be converted back into code, however). Frustratingly, none of these seem to use the same external standard, which to me kind of defeats the purpose of creating abstract syntax trees, but at least they exist. They're open source as well so hopefully I can customise them to accept the standard used by acorn.js.
Speaking of, I've ran into an issue with acorn.js- it doesn't seem to be able to parse import statements properly. There's some shenanigans where the parser throws an error if I use the class method #parse, but if I use the instance method #parse it returns an undefined value instead of throwing an error. It took a lot of the day to track down the issue to something as specific as this, and there doesn't seem to be anyone else online who's ran into the same issue. If I can't resolve this I'll try using Babel's parser, but this has been very frustrating, discovering an issue like this so far into the project.

<<<<<<< HEAD
### Tuesday, 15th February, 2022
=======
###Tuesday, 15th February, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

In order to see if its viable to generate visual programs in different languages, I decided I had to become familiar with Electron, which seemed to me the most high-level and viable candidate for GUIs. I spent the day writing a game in Electron to get used to it (Pong for two players), and I enjoyed how similar to JS web development it was, particularly as there was no need to interact with a very library-specific renderer or window object, which is by far the least standard part of GUI development and therefore the part with the steepest learning curve.

I've looked into using Electron with other languages, and it seems like there are several different options for implementing a back-end to a visual Electron program in languages other than JS. The most viable ones seem to be either outputting the finished program as a local web application and communicating with it via HTTP requests, or using sockets for inter-process communication.
I'll look into these in the next week and see if I can write an Electron program with a Python back-end.

<<<<<<< HEAD
### Wednesday, 16th February, 2022
=======
###Wednesday, 16th February, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Just writing a quick plan for the next week so I can clarify what I want to work on this week. I would like to:
1. Write a Python program that can control an Electron GUI (most likely, by re-implementing my earlier Pong game)
2. Try to resolve my issues with using import statements
3. Rewrite deliverable 1 (ideally in full, but at least partially)
4. Start planning deliverable 2

Just out of the meeting with John. He thinks that the GUI features should come later in the program, which I think is pretty reasonable given the complexity of implementing this. He suggested that this week I should work on a folder of test cases, both for the end user to verify the program's functionality and to aid potential developer's/contributors to structure their work. So for the next meeting I'll try to finish a folder of test cases, following all the features I've implemented so far.

<<<<<<< HEAD
### Friday, 18th February, 2022
=======
###Friday, 18th February, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

Started work on a test files folder. This is meant to provide an outline to potential users of the features provided by this project, as well as help structure the development of further transpilers if other developers want to contribute. 
I've also added ternary statements in each language, as well as logical expressions (and, or, etc.).

<<<<<<< HEAD
### Tuesday, 22nd February, 2022
=======
###Tuesday, 22nd February, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

The good news: I've completed the tests folder for all the features implemented so far. Pretty happy about this, especially as I've had to hand in web design coursework and do a databases exam in the last week. 
The bad news: I have covid. This has made it quite a bit harder to work, and I'm pretty sure I'm not going to be able to attend the meeting tomorrow. Thankfully the tests folder was most of the way there by the time I started feeling really sick, so I managed to get that finished off.

<<<<<<< HEAD
### Thursday, 24th February, 2022
=======
###Thursday, 24th February, 2022
>>>>>>> b9ebfc495dcbcd089ce270094de9a2957c8591d3

I've been thinking about the blog post due next week, and the work I've done so far. I'm happy enough with the eventual goal of my project, and I think it will be useful, but I'm a little embarrassed by the lack of functionality it offers at the moment. I decided to add some abstraction features before the blog post is due, just so I'm able to demonstrate to the end user/developers that there is already some utility in my project, even though it's only been under development for a month. I decided that higher-order functions (i.e. passing functions to other functions) are pretty useful, and JS and Python both already support them, so I spent the day implementing that in Ruby as well. 
I found this extremely difficult. My solution relied heavily on regexes, which i had barely used before this project but now feel pretty experienced in. Basically, Ruby doesn't support passing functions as arguments unless they're wrapped in special syntax both when they are passed to a function, and when they are called in that function. I found it difficult to get this done, but got there eventually, only to immediately have to repeat the process once I realised my solution didn't work with nested function calls. It seems to work now, but I'm sure I'll find some other bug in it soon.
The other feature I'd like to implement are structs. This is easy enough in JS, which even supports object literals, but I think I should maybe leave this until after the blog post is due, or at least finish that first.
I've put a good deal of thought into how I'm going to set up for the blog post next week, and I've got some strong ideas, as well as a lot of free time in isolation. Tomorrow, I'm going to redo deliverable 1, so I can reference it in my blog post and justify the features I'll have implemented. Then, I'm going to ensure all of my source code is implemented. Then, I'll do a preliminary blog post, and show it to my dad and one of my mates on the course for feedback, as they're of the target demographic (a programmer advanced enough to use/expand on the project after reading the documentation).
