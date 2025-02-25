### Tuesday, January 11th, 2022
Just started CSC1028! Nearly didn't make it- the Undergraduate Office Supervisor sent me an email about what module I wanted to drop for this one, and I didn't see it until it was very nearly too late- thankfully she sent a followup email, which I did see. 

I felt very excited to start this module. I had completed some projects myself before starting university (which is how I got into programming and CS in the first place), and was a little disappointed in the pacing of the first term- I found the Architecture and Networks module, as well as the maths module to be quite interesting, but I was a little disappointed with the standard of the coursework for the OOP module. It was more about implementing the theoretical concepts of OOP than problem solving skills, which is perfectly understandable- it was a module for teaching a theoretical model of software- but that doesn't make it enjoyable to actually sit down and do.

So when the opportunity arose to work on a project for 6 months with no theory or exams, I grabbed it with both hands.

I also managed to secure my first choice for a project! This is a program that enables another program to be converted to an abstract form (known as an 'abstract syntax tree', or AST), and from there into a different programming language. This picks up on something that greatly interested me from the first term, but was only mentioned in passing. During the architecture section of the A&N module, it was mentioned that a compiler converts a program to 'intermediate representation' (IR) in order to apply optimisations to it, before converting it into assembly and then into binary. It was also mentioned that many different programming languages can use compilers that only have to handle conversion to IR- from there, the same toolchain can be used to generate the final executable. This interested me because it demonstrated that all programming languages were essentially so much window dressing- that they were all fundamentally the same, and code written in many different languages could be boiled down into the same form, and made equivalent to each other. This also helps remove some of the mysticism from programming languages- they are less arts to be learned, and more tools to be used. This is very reassuring to the beginner, as it can at times seem that the greatest obstacle in software development is the vast array of languages to choose from and dedicate time to learning, when in practice the language chosen for a new project is usually of not much consequence other than what the developer prefers and what libraries they need.

But that's enough background. I got started on the project today by installing npm, nvm (version manager for npm), and acorn, a utility that allows for the conversion of javascript scripts into AST format (represented as a JSON object). Despite using Javascript before, I had forgotten most of what I knew about it, and spent the majority of the time just trying to remember how to do File I/O and run scripts from the command line. Eventually, however, I did manage to produce the beginnings of the project- a small script that can convert a JS script (given as an argument on the command line) into AST, and store that AST in a .json file. The major challenge of the project will be converting AST objects back into source code. I would guess that maybe different languages can be described by JSON files? So adding a new language as a possible output would only require supplying a new JSON file linking each AST identifier to keyword(s) in that programming language. But I am sad to say that I do not think it will be that simple.

John made a big point in the lecture today (the first and only lecture!) that we should focus on making something other people can use. I think this is a good outlook- knowing that what you're working on can help other people is a great motivational tool. I think a good goal for this project would be to create the framework for converting one language to another, and make it as easy as possible for other people to adapt this and add functionality for other languages to be converted to and from. An immediate problem that springs to mind is external libraries and language-specific features, but I'll wait until my first meeting with John before I worry about that.

### Wednesday, January 19th, 2022
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

### Friday, January 21st, 2022
Just started work on a parser for converting AST back into code. So far, I have a parser specific to JavaScript that can handle simple method calls and arithmetic (which also preserves brackets and order of operations). Was a bit hesitant to start as I expected this to be really quite difficult, but so far not too many problems have come up. The next step is to begin work on a more general parser- my target is to be able to convert to Python and Ruby at each step of the parser's implementation. I chose these languages in particular due to:

1. My familiarity with them (easy to quickly validate the output of my program)
2. Their similarities with JavaScript- both support OOP and are both interpreted and dynamically typed

I'll take a look at how Babel structures the code for its more complex parser, and then start adding on to mine.

### Sunday, January 23rd, 2022
Made some good progress with the parser. I've brought it over from a basic set of functions global to the script to an organised super class (Parser), with sub classes started for JavaScript and Python. This means that I can override methods when language differences need to be taken into account (e.g. syntax for delcaring a function, ending lines with semicolons), but share methods for common functionality, like arithmetical expressions.

Quite happy with this approach, and how quickly I managed to implement it, so it looks like last term's OOP class has ended up being very heplful. 

The next step for the parser will be more complicated language features (such as functions, classes, etc), and adding in indentation (which is needed for Python to even run a script).

It's towards the end of the day now, and I've added function declarations and calls and variable declarations. It was tricky to deal with the buffer system I used for the parsers, where code was just added to a string, so I've also created a Buffer class. This makes it easier to deal with indentation, and makes interaction with the text buffer generally a lot cleaner. I've also updated the main script to produce output in both JS and Python automatically.

### Monday, 24th January, 2022
More work done with the parser- if, else if, else, and while statements. I've also decided that while most work in converting AST to a specific language can be done by the parser itself, a post-processor would be useful for converting some awkward key-words: for example, Python converts "else if" into one keyword ("elif") and it's simply easier to have the post-processor replace all instances of one with the other than try to modify the parser too heavily. I'll work on some more features for the parser to take care of, and then start looking at the first deliverable.

### Wednesday, 26th January, 2022
Just out of another meeting with John. He's suggested an adjustment to the project's scope; originally, I was planning on a translator that could convert programs between a bunch of different languages, but John has suggested that I try to create a program where someone can make a basic specification of a program and the functionality they want it to have, and source code in their destination language would then be generated. I think that both of these sound interesting, but for now I'm going to focus on working towards the first deliverable. 

Before the meeting, I was pretty unsure on what to do for it- I haven't had any difficulty getting my project set up, so there would be no use to creating a how-to guide. I was then thinking about the earlier suggestion of comparing "hello, world" programs in different languages, but I found it difficult to think of anything useful I could write on that. I asked John about this during the meeting, and he suggested that an interesting topic to write about would be language-agnostic programming. Basically, this would be writing an article in advocacy of writing code in non-idiomatic ways when possible. This would both help to avoid being stuck with a program that's very difficult to port to another language, and enable the programmer to write code that would be very easily understandable to other developers from diverse backgrounds. This sounds very interesting, so I'm going to start planning an article around that.

### Sunday, 30th January, 2022
Just finished writing up my plan for the article. I've decided to compare the advantages and disadvantages of writing code in an idiomatic style, and of using lots of abstractions in program-writing. I think that this could be an interesting read. In my plan, the article isn't necessarily aimed at either beginners or advanced programmers- it is aimed at anyone with an understanding of how to program, and who will know enough to have run into scenarios where they have used programming abstractions. It will try to persuade the reader not necessarily of fundamentally changing how they write programs, but in how they *approach* writing programs, and to try and consider the future of their project when they are starting out. 

### Monday, 31st January, 2022
Finished writing the article, based on the plan I wrote yesterday. I've tried to be very balanced in my writing, and not advocate too hard for either side of the issue. I'm not trying to convince the audience that idiomatic code is always a bad ideal to strive for, or that all code should be ugly and abstractionless. I'm just trying to encourage the reader to put some planning into their projects with regards to how much technical debt they should be taking on by writing their code in an abstract, language-dependent way, and to consider if they might have to switch up what technology they're using in the future. I've added that focusing too much on writing idiomatic code can actually be very distracting from the much more important goal of writing code that progresses their work, as well as a section on how abstractions can also be very useful in programming (for balance). The article concludes by saying that, as with all tools, it is more important to know when to use abstraction than how to use it. This is the main point of the article- encouraging thoughtfulness about how a program should be written.

I've also done the markup and styling for the article, and I'm fairly proud of how it looks. I'll show the article to John during the meeting on Wednesday and see if I need to make any adjustments before handing it in.

### Wednesday, 2nd February, 2022
John seems happy with the article, which is good- I have no idea what I would have written about if he thought I should change subject. He emphasised that my diary is very important to the marking for the first deliverable, so I've gone over what I've written and tried to clearly explain why I wrote what I wrote, its goals and its audience. 

He says that after handing in this deliverable, the next week should be spent on planning- tidying up code I've already written, looking at the next deliverables, and planning the project's direction. I'm feeling pretty confident at this point. I was initally very worried about the article, but I think I've managed to produce something of use, and justified it fairly well. I'm also looking forward to spending a week just getting to think about what I want to do, and doing some maintenance tasks. 

### Sunday, 6th February, 2022
Did some general tidying of the source code today- splitting it up into different directories for source code, deliverables, the diary, etc. I also checked out the communities John mentioned in our last meeting, in order to get their vibe and get an idea of the form my next deliverable should take. I think the presentation of my work in each should likely be very different, as LessWrong seems more focused on self-improvement and -reflection, and HackerNews seems to me more like old Reddit. Speaking of, Reddit might end up being a good place to share my work to, which would suit me well as I am already familiar with the community.

### Monday, 7th February, 2022
I've done some thinking and planning about the project. I think a good goal for this week would be to explore using file systems across languages, and try to implement basic file I/O. This would run into having to handle imports in different languages, which would be interesting and probably make up a lot of the complexity. I also think I would like to take a look at Electron- both due to its importance to the project and because I really like making visual applications. This would give me some insight into whether it's feasible to have an embedded Electron frontend and generate back-end source code in different languages to control the program's visual output. This should also help me determine what the feasible scope of my project is going to be, in terms of how diverse of a functionality I can implement across different languages.

### Wednesday, 9th February, 2022
Woke up early this morning to do some extra work before the meeting. I created a transpiler for Ruby, got it up to date with the other two transpilers, discovered and fixed a few bugs with the others (parameter lists not being written properly, if statements not being formatted with brackets in JS, etc). I also learned how to use regexes in JS; the Python transpiler needed to have expressions of the form 'array.length' transformed to 'len(array)', and I figured it was probably pretty straightforward to use regexes for this (it was).

I think that with adding array support that this should be very close to being 'good enough' to write across different programming languages. The one thing I would like to add support for is structs, because I think that should bring my program pretty close to the functionality of C- a language used for 'real work' all the time. 

I saw my mark for deliverable 1 a short while before joining the meeting. I'm disappointed, but I can understand why it was marked the way it was. I did feel very unsure about what direction I would take with it, and didn't pay enough attention to the assessment criteria, so I can see where the mark came from. I think that for the second deliverable I would be more likely to rewrite the first deliverable completely before building anything on top of it. I would refocus to be more instructive- *how* to write programs simply, not just a piece looking at the upsides and downsides of doing so. At least I know how to approach the next deliverables, and should be able to do better in them.

### Sunday, 13th February 2022
Because I'll end up having to largely rewrite deliverable 1 (both to build on it for deliverable 2 and because I'm not happy with the standard of it, if my work is going to be public), I researched what other people had already contributed to the topic of writing portable code. Most resources seem to be focused on code portable between different platforms:
- [this one](https://medium.com/trueface-ai/how-to-design-a-language-agnostic-cross-platform-computer-vision-sdk-e437ecac8b4e) about writing an SDK that works across different architectures)
- [this one](https://pontus.digipen.edu/~mmead/www/docs/WritingPortableCode.pdf) is an extremely in-depth look at writing code across platforms and compilers. Particular to C, C++, and game development, with a look at Java at the end)

These articles aren't about exactly the same topic as what I'm writing about, but there is still some valuable information in both. The Medium article is a great look at how to package software libraries, which will come in handy later in the project, and both give advice on how to separate platform-specific code from the general program logic, which is demonstrative on how I should be structuring my own program to generate code.

The best resource by far that I found on language agnosticism is this [Github repo](https://github.com/mankenavenkatesh/Language-Agnosticism) that aggregates other resources, and is designed to teach language agnosticism. I'll likely be basing my deliverable on some of the content from there, and trying to condense it into a more approachable article than a full course of content.

I'll spend up until the meeting this week planning what I want to write my deliverable to say, and then do the actual rewriting the next week, at the same time as starting to look at the next deliverable.

### Monday, 14th February, 2022
Decided to do some work with the transpilers today. I've looked into it, and libraries exist for converting Python into and out of AST, and for at least converting Ruby into AST (not sure if it can be converted back into code, however). Frustratingly, none of these seem to use the same external standard, which to me kind of defeats the purpose of creating abstract syntax trees, but at least they exist. They're open source as well so hopefully I can customise them to accept the standard used by acorn.js.

Speaking of, I've ran into an issue with acorn.js- it doesn't seem to be able to parse import statements properly. There's some shenanigans where the parser throws an error if I use the class method #parse, but if I use the instance method #parse it returns an undefined value instead of throwing an error. It took a lot of the day to track down the issue to something as specific as this, and there doesn't seem to be anyone else online who's ran into the same issue. If I can't resolve this I'll try using Babel's parser, but this has been very frustrating, discovering an issue like this so far into the project.

### Tuesday, 15th February, 2022
In order to see if its viable to generate visual programs in different languages, I decided I had to become familiar with Electron, which seemed to me the most high-level and viable candidate for GUIs. I spent the day writing a game in Electron to get used to it (Pong for two players), and I enjoyed how similar to JS web development it was, particularly as there was no need to interact with a very library-specific renderer or window object, which is by far the least standard part of GUI development and therefore the part with the steepest learning curve.

I've looked into using Electron with other languages, and it seems like there are several different options for implementing a back-end to a visual Electron program in languages other than JS. The most viable ones seem to be either outputting the finished program as a local web application and communicating with it via HTTP requests, or using sockets for inter-process communication.

I'll look into these in the next week and see if I can write an Electron program with a Python back-end.

### Wednesday, 16th February, 2022
Just writing a quick plan for the next week so I can clarify what I want to work on this week. I would like to:
1. Write a Python program that can control an Electron GUI (most likely, by re-implementing my earlier Pong game)
2. Try to resolve my issues with using import statements
3. Rewrite deliverable 1 (ideally in full, but at least partially)
4. Start planning deliverable 2

Just out of the meeting with John. He thinks that the GUI features should come later in the program, which I think is pretty reasonable given the complexity of implementing this. He suggested that this week I should work on a folder of test cases, both for the end user to verify the program's functionality and to aid potential developer's/contributors to structure their work. So for the next meeting I'll try to finish a folder of test cases, following all the features I've implemented so far.

### Friday, 18th February, 2022
Started work on a test files folder. This is meant to provide an outline to potential users of the features provided by this project, as well as help structure the development of further transpilers if other developers want to contribute. 

I've also added ternary statements in each language, as well as logical expressions (and, or, etc.).

### Tuesday, 22nd February, 2022
The good news: I've completed the tests folder for all the features implemented so far. Pretty happy about this, especially as I've had to hand in web design coursework and do a databases exam in the last week. 

The bad news: I have covid. This has made it quite a bit harder to work, and I'm pretty sure I'm not going to be able to attend the meeting tomorrow. Thankfully the tests folder was most of the way there by the time I started feeling really sick, so I managed to get that finished off.

### Thursday, 24th February, 2022
I've been thinking about the blog post due next week, and the work I've done so far. I'm happy enough with the eventual goal of my project, and I think it will be useful, but I'm a little embarrassed by the lack of functionality it offers at the moment. I decided to add some abstraction features before the blog post is due, just so I'm able to demonstrate to the end user/developers that there is already some utility in my project, even though it's only been under development for a month. I decided that higher-order functions (i.e. passing functions to other functions) are pretty useful, and JS and Python both already support them, so I spent the day implementing that in Ruby as well. 

I found this extremely difficult. My solution relied heavily on regexes, which i had barely used before this project but now feel pretty experienced in. Basically, Ruby doesn't support passing functions as arguments unless they're wrapped in special syntax both when they are passed to a function, and when they are called in that function. I found it difficult to get this done, but got there eventually, only to immediately have to repeat the process once I realised my solution didn't work with nested function calls. It seems to work now, but I'm sure I'll find some other bug in it soon.

The other feature I'd like to implement are structs. This is easy enough in JS, which even supports object literals, but I think I should maybe leave this until after the blog post is due, or at least finish that first.

I've put a good deal of thought into how I'm going to set up for the blog post next week, and I've got some strong ideas, as well as a lot of free time in isolation. Tomorrow, I'm going to redo deliverable 1, so I can reference it in my blog post and justify the features I'll have implemented. Then, I'm going to ensure all of my source code is implemented. Then, I'll do a preliminary blog post.

### Friday, 25th February, 2022
Started off today by finally coming up with a name for the project. The first thing that came to mind was 'babel' (because the Tower of Bable was responsible for spawning many languages from one source), but this is already taken by [babel.js](https://babeljs.io/), which is a much more notable project. Instead, I've went for 'semantic' - the semantics of a language are the meanings expressed by the words in it, which I think suits my project quite well, because I'm focusing on the 'meaning' of code rather than its grammar or syntax.

Today, I mostly did research for deliverable 1, to make sure it's of a higher standard this time. I decided to base it off of the w3schools guides to programming languages in terms of structure (particularly, the guides for [C++](https://www.w3schools.com/cpp/cpp_getstarted.asp) and [Java](https://www.w3schools.com/java/java_intro.asp)) but decided to start my guide with a definition of what makes a programming language Turing complete. This means that I can start off the guide by giving some perspective on how many features are built on top of such a simple base. With the structure I use, I start with simple language features such as variables, primitives and commenting, and work up to loops, functions and abstraction features. I chose to adapt this structure from w3schools because it also maps nicely on to how difficult it is to be language agnostic about these language features, starting off easy and getting progressively more difficult. 

### Saturday, 26th February, 2022
Finished completely re-writing the deliverable today. It'll need a second pass to make sure it's up to scratch, but it's good enough now to start using as a reference in the blog post. I also created a README file, as a start to getting the github repository ready for public use.

### Sunday, 27th February, 2022
Decided to start off by creating a npm package based on my project, as an easy way to share my work and as a basis for deliverable 2.

npm package finished! It's currently in version 1.1.0. I added an example script to the project in order to demonstrate its functionality- a hangman game implemented in JS, that can be automatically converted to Ruby or Python.

I've started work on deliverable 2 now, and decided to look at the documentation for some other JS projects for an idea of how to structure my work. In particular, the [Electron](https://www.electronjs.org/docs/latest), [Angular](https://angular.io/docs) and [Vue.js](https://v2.vuejs.org/v2/guide/?redirect=true) packages seemed to me to present information in a professional, logical manner. I will use these sources to come up with the basic outline of the content I should present, and how I should present it.

The basic outline I've settled on is:
- A brief introduction to the project and what it does
- Motivation- a more in-depth look at what problems Semantic is trying to solve, how and why
- Getting started and running tests- how to get the project up and running
- Features and examples- show off Semantic's features
- Contributing to development- list some valuable sources for learning about the project's background, and then explain the code I've written in depth.

This is along the same lines as the reference materials I used, as those all followed the formula of a brief introduction, explanation of the project, showing off its features, and then a more complicated view at using/contributing to it. I imagine this formula would work well for someone with no experience or prior knowledge of my project, as they would first be introduced to its purpose, why it does what it does, and then finally what it can do and how it works. Building understanding of the problem it's trying to solve first should not only help to convey the value of my work, but also to help them understand the project's internals in a more abstract sense, like an overview of what it does.

Additionally, starting with the motivation and features is great for immediately conveying the utility of my project to a wider audience, and is conducive to 'selling' it as a utility to other developers- something that John has heavily emphasised in prior meetings.

I've added some additional features to my transpilers as well, supporting some basic command line and file-based I/O. Corresponding test cases have been added.

### Monday, 28th February, 2022
A lot of good progress made on deliverable 2, although I have had to heavily prioritise this over my other modules (which does induce quite a bit of stress). However, seeing as I'm nearly finished I don't feel too anxious about it, and should have plenty of time in the second half of the week to catch up on other subjects.

### Tuesday, 1st March, 2022
Just finished the first draft of deliverable 2. Feeling a lot more confident now than I did after getting the mark for deliverable 1 back, having taken a lot of care to follow the assessment criteria well.

I showed my draft to my dad. I thought that his background in programming would make him a good representative of the guide's target audience, as he has enough experience to use and expand upon the project after reading its documentation. He thought that the guide did a good job at explaining the project's motivation and goals, as well as what problem it was trying to solve, and that it gave a good overview of how the code actually works. He had some problems, however, with some sections reading like I didn't implement something because I didn't want to, and some confusing wording in other sections. I quickly fixed these, and put some finishing touches to each deliverable, so that there's more cohesion between the two.

I also managed to show it to my mate doing Software Engineering at Ulster. He said he felt like he got a good sense of what the project was trying to do, and that he'd be able to work on it after reading through the article. He was briefly concerned that I was trying to get him to do my course work for me, so I had to explain that I was just asking him "Would you be able to work on this?" as a hypothetical.

I was testing out my npm package by installing it in a test directory. I noticed something concerning, however: npm highlights several 'moderate vulnerabilities' in Semantic. These all seem to be due to a vulnerability existing in prompt-sync, so I'll probably just uninstall it in the Semantic repository and direct users to install it themselves, as it is the only method command line input supported at this time.

### Thursday, 3rd March, 2022

Got some really good feedback from John yesterday during the call. He told me that he had never been sure from my diary what stage of the project I was actually at, which briefly induced some panic. However, looking back, I do talk a lot about what I want to do next, and what I've done, but often don't mention the things I *haven't* done, either by being advised not to or just prioritising something else. I have therefore been very specific in the deliverable about exactly what Semantic supports, and have given several examples from the test suite. I've also given several clear goals of what I want to work on next for Semantic. This not only helps with communicating exactly where I'm at in regards to workflow, but adds in to something else John talked about- making sure another student would be glad of the format that the deliverable is in. 

I think if I were another student being given this project to work on, I would be happy with the format it's in now, after I made the additions John suggested.
- I have made the commercial value of my project more clear. I have given several examples of libraries that, if ported, would provide a lot of use to the development community. I have made how they're useful more obvious as well.
- I have clearly communicated what features are implemented in Semantic, and why I've tackled them in the order I have: focusing first on implementing a solid foundation that allows for writing functional programs. 
- I have given a list of items that should be worked on next, so that a student being given this project has a clear idea of what they should be working on.
- I have given an in-depth list of useful resources for development, as well as explaining how my source code works. This should make adding additional source code as easy as possible.

I am now confident that this is a piece of media that would be very useful for another student, as I explain the use, features, goals, and source code for my project in a way that is hopefully not just explanatory, but motivating. My hope is that another student would see this and not only understand how to add to my project, but have the motivation to *want* to add to my project.

### Sunday, 6th March, 2022
My luck with getting sick seems to be very bad lately- I think I've caught the flu.

### Tuesday, 8th March, 2022

Mostly back on my feet as of today, but I lost a couple of days due to being sick. I was really worried I was going to miss another meeting, which probably wouldn't have been a very good look. Thankfully, however, I've managed to pull through. 

Today, I started implementing support for classes in my transpilers, and have so far implemented method definitions. I plan to implement variables and inheritance tomorrow.

I have also decided to make some changes to the tech stack I'm using for the project. Acorn does not support class definitions by default, and getting it to output AST describing a class would require using plugins (which are pretty janky in acorn's case). On the other hand, babel's AST generator supports class definitions natively, and is based on acorn, so I've managed to switch over to that pretty seamlessly.

I haven't had as much time as I would like to work on my project at the minute. This is both due to being sick and the coursework due for my other two modules in the next couple of weeks. However, by the end of the month the stress will all be over, which is nice.

### Wednesday, 9th March, 2022

I've been putting some more work into the project before the meeting this morning, specifically on classes. Some features have been easy to implement and work fine, such as constructor functions and inheritance. There have been a few other features that I have not yet implemented because they were unexpectedly difficult. For example, in JavaScript static and non-static methods are invoked the same way, `this.functionName()`, whereas in Ruby they are called differently: `self.functionName()` and `functionName()`. As there is no difference in the AST generated for these two cases, it seems that the only way to correctly generate code is to write code that can recognise if a method called is static or non-static, by scanning the class for its definition. 

Running into a roadblock of this size before I've even got classes fully working has made this morning quite hectic. Additionally, switching over to the other AST generator has introduced a few new bugs into the project. I think that for now, I'll ignore the complicated issues with introducing support for classes, and just get the basics sorted. I'll fix the bugs after that.

### Sunday, 13th March, 2022

Just got my result for deliverable 2- I'm very happy with the mark I received this time. It reflects that I put a lot more work and diligence into following the assessment criteria, which I'm glad about. I spent today organising a plan for what to add to deliverable 2 for my final submission, based on the feedback I've received from John. 

I'm going to add in a section about creating the NPM package, and how it's organised. I'm also going to get someone else to test it on their computer, just to make sure that the instructions aren't too difficult to follow. 

I'm also going to add some more scope to the goals section, just so any users/potential developers get an idea of the more long-term scope of the project, and what I would like to achieve, as well as possible features that could be implemented.

For now, I'm going to keep working on implementing classes, and then fill in the relevant information on the deliverable when I'm finished.

### Tuesday, 15th March, 2022

I've managed to fix the problem with static functions needing to be called with different syntax in Ruby to JavaScript, which required me to take an approach I haven't taken before in the project, which is keeping track of state while converting AST to destination code. Basically, while the transpiler is inside a class definition, I keep track of all the methods defined as static, and insert the appropriate keywords when those methods are called. 

Classes are working in Ruby now (or I at least haven't discovered any bugs yet). I'm going to now start working on implementing them in Python now.

I haven't managed to spend as much time this week on the project as I normally would; I have web tech coursework due on Friday, so I've been finishing that off. Also, this week was the first time that I've been able to meet up with my group for the group coursework (as I've been sick), so I've had to do a lot of work on that just to catch up.

### Wednesday, 16th March, 2022

Just doing some further work before the meeting, and I've noticed something quite annoying. JavaScript performs type coercion at runtime, and will happily concatenate a String with most other types. Ruby and Python both don't do this automatically, and would throw an error, but so far I've got round that by automatically adding explicit type conversions when generating source code. However, there are situations where I cannot detect if concatenation is going to occur such as when the return values of two functions are added together, as the type of a return value is not fixed in these languages. I will therefore have to stipulate to users of my project that any concatenations have explicit type conversion, as it is not possible to generate correct code in these cases automatically.

Just out of the meeting with John. He recommends not doing any more technical work, but to focus on making sure everything is perfect for the final deliverable (which is essentially a more complete form of the existing deliverables, and a short social media post). This is great news, as I'm really feeling the crunch from my other modules at the minute. I've made a note of what he thinks I should improve on, and I'll work on that over the next week.

### Friday, 18th March, 2022

Was taking a look at the source code today, just to decide what state I should leave it in when I hand in the deliverable. I think that I should actually remove the class support from the last 'official' release of the module, as there are still some existing errors and bugs in the current implementation. Additionally, classes are not supported in Python, and it doesn't seem right to support them in one language but not another. Also, I imagine it would be quite difficult for a future contributor to add to the project if I leave half-finished features in the source code. Still, I'll leave the current edition of the source code in the GitHub repository's commit history, as it could be used as a guide to implement class features in a much more rapid manner than working with no prior material.

### Sunday, 20th March, 2022

Spent today editing deliverable 1 and 2 to get them ready for final submission. Deliverable 1 was fine, just some editorial changes. To deliverable 2, I added the details about the npm package (how I made it and how it works), and some more detail about the long-term goals of the project. I've also had to amend the section about the acorn parser to instead being about babel.js's parser, as I've switched over to using that. I should probably add in as well about how the project used to use acorn, list the problems with it and explain why I moved over to babel- talking about the project's problems seems to be a big deal in the assessment criteria.

### Wednesday, 23rd March, 2022

I had a meeting this morning with my mates in Web Tech for our group project. I have managed to get one (maybe two? wasn't sure what her answer was) to try installing and using my project, just to make sure it works. Unfortunately, nobody had their laptop with them except for me, so I'll have to message them this afternoon and ask if they're okay to do some testing.

Work I have to do for the final week: 
- Go over the diary and make sure I hit the mark on everything.
- Strip back the source code, and recommit it.
- Add the finishing touches to deliverable 2.
- Get my mate to test out the npm package and make sure it works.

This should all be very achievable. Ideally, I would really like to submit the final deliverable before Sunday.

Just got out of the meeting- John seems happy with the current state of affairs as well. Something he has put some emphasis on over the course of the meetings is that I should provide potential users/contributors some concrete examples of how my project can provide value. I think I've done a good job in this area with regards to porting libraries and source code, which I've even backed up with some specific examples. An area he thinks I should discuss in the deliverable is the development of mobile applications/web applications. I agree that writing code designed for one platform that can be automatically converted to work on another sounds like a great idea, but I honestly don't have enough experience in either of these areas to discuss to my project's utility in them in any valuable way. It is for this reason that I have stuck to an area I have plenty of experience in (libraries), with several examples to illustrate my point. 

Spent the afternoon fixing the source code, so that's all up to date and sorted. Reverted it back to how it was before classes were added, along with completing the transition over to babel.

### Friday, 25th March, 2021

The first thing I did today was make sure that the source code is really well commented. I want to make sure that anyone who wants to contribute additional code is able to get started as quickly as possible- not just because of the assessment criteria, but because I have experience in trying to use poorly documented libraries, which can be incredibly frustrating. A big part of this is trying to reduce the time it takes to get up to speed. This is a period of looking at a code base and just trying to make sense of the purpose of the discrete sections of code before being able to actually contribute anything. Comments are a great way to shorten this period, as it takes the contributor less time to understand the functionality of the code they're looking at.

I also got my mate to try out the npm package. She seemed impressed with what my project does, which was quite nice, and also provided some good feedback. She thought that the library itself seemed easy enough to use, as it only requires calling functions, but that the testing interface wasn't so straightforward, as the user has to clone my Github repository. I would agree with what she said, but it's unfortunately a bit too late in development to adjust how the test script works. Additionally, I'm not too sure how to include code in an npm package that isn't part of the package's API, so this is something I would have to research. If I continue to work on the project after handing it in for submission (which I'm considering, as I'll likely want something to work on between uni ending and my placement starting), this will definitely be something I look at. 

At the moment, however, I would not think that how the test cases are accessed is likely to impede the progress of a new contributor. As ease of use is the most important point of the final deliverable, I would prefer to maintain an inelegant solution that works well than to rush a new implementation that might not. I have provided an explanation in the blog post of how the testing for this project works, and how they can expand upon it to benefit their own development process. This also provides the 'testing plan' John mentions in the criteria for final submission. I have added a note on the blog post that a test-driven approach to development is the best way to make rapid progress on this project, and given an overview of how to go about implementing this approach with the project.

I published the latest version of the npm package today as well.

### Saturday, 26th March, 2022

Today, I took a look at social media to see where I should post about my project and how I should format it. Thankfully, John has said we don't have to *actually* submit this post, just make an outline of it. This is good, because while I do believe this project can eventually provide great value to a lot of people, it is somewhat lacklustre in its current state, and I would prefer to advertise it when it's more complete. I decided to make a social media post for my blog post/project in general as I think it's much more interesting and beneficial to the average developer than my how to guide.

On r/programming, a subreddit I frequently visit myself, the posts about personal projects that make it to the top posts of the month (used as a gauge for how to write my post) are all link posts:
- [Ever wanted to write Discord bots in C? Probably not, but here is a library for it anyway - introducing Concord!](https://www.reddit.com/r/programming/comments/tcjosy/ever_wanted_to_write_discord_bots_in_c_probably/) (1.8k upvotes)
- [A cross-platform minigolf game I wrote in C.](https://www.reddit.com/r/programming/comments/tm4vsz/a_crossplatform_minigolf_game_i_wrote_in_c/) (1.5k)
- [GitHub - ZeroIntensity/pointers.py: Bringing the hell of pointers to Python.](https://www.reddit.com/r/programming/comments/tb235g/github_zerointensitypointerspy_bringing_the_hell/) (1.3k)

These are very illustrative of what sort of post I should create for this subreddit: a catchy title that captures my project's name, goal, possibly the language it's written in, and a link to my Github repo. Unfortunately, however, I have to write a text post, not just come up with a title- and r/programming only accepts link posts anyway. Nevertheless, this is very helpful with coming up with a title for my post.

r/javascript, a subreddit I am less familiar with, seems to share a similar userbase and has similar results for the most successful posts of the month:
- [Postgres.js – Fastest Full-Featured PostgreSQL Client for Node and Deno](https://www.reddit.com/r/javascript/comments/tn0sxp/postgresjs_fastest_fullfeatured_postgresql_client/) (379 upvotes- not as much as r/programming, but this is the second highest rated post of the month at the time of writing)
- [Introducing Ladle, a drop-in alternative to Storybook for React components. Based on Vite , instant server start, 4x faster production build, 20x smaller footprint, code-splitting, fast refresh, single dependency & command and no configuration required.](https://www.reddit.com/r/javascript/comments/ter270/introducing_ladle_a_dropin_alternative_to/) (204)

They also accept text posts, some of which get a fair amount of traction:
- [(AskJS) Why is is prettier used if eslint can format?](https://www.reddit.com/r/javascript/comments/tc3ecw/askjs_why_is_is_prettier_used_if_eslint_can_format/) (124)
- [(AskJS) Why not just add 'application/typescript' support for browsers.](https://www.reddit.com/r/javascript/comments/tj05o1/askjs_why_not_just_add_applicationtypescript/) (83)

I have therefore decided to post to the r/javascript subreddit, as it mirrors a subreddit I am familiar with the community of, while allowing text posts. Also, my project is in JavaScript, meaning that this subreddit is the ideal audience of readers who are guaranteed to be able to contribute (even though they may not want to).

Both of these posts attempt to persuade the reader of something. The first merely illustrates an issue; the second presents a solution. From these posts, it is clear that in order to create a post that captures attention, I should specify the problem I am trying to solve first, and then my solution. I should do this in simple terms, as I haven't seen any salesman-like pitches in the top posts of either subreddit, just posts that clearly show off their work and allow the reader to judge its value. The problem I present should also be of relative importance: the first questions toolchain use, and the second is about a current hot topic in JavaScript development. Both of these are issues the community would care about, and show I should try to present the problem I'm solving as something the community should care about.

Another good reason to be straightforward and concise is that posts that have unclear topics/motivation do not do as well. [This post](https://www.reddit.com/r/javascript/comments/tk9nnp/askjs_with_growing_complexity_today_inside_the_js/) also attempts to spark discussion, but does not gain much traction. I believe this is due to its unclear subject, and the poster's failure to provide much valuable input of their own.

Just finished writing the post there. I introduced the project by name, specified a problem (libraries only being available in certain languages), gave an example (Flask only being accessible in Python), stated how my project solves that problem, and how this benefits developers. I made sure to mention that the project is still in its infancy, and doesn't provide that functionality yet. I also provided a link to my Github page, for those who would like to track its progress or contribute to development. John asked us to link to the blog post/how to guide, but the Github repo's README file quickly points to my blog post as a complete guide to the project, and the two successful project posts on r/javascript both just link to a Github repo.