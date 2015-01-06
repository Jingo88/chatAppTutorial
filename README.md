# What Is This Project?
This tutorial has been put together by four great minds to share to the public the various ways to build a chat application using Node.js, JSON, web sockets, and the like. Please feel free to look through our webpage, and if you like what you see then feel free to e-mail us happy thoughts and pictures of cats. If you don't like what you see then feel free to e-mail us happy thoughts and pictures of cats. Thanks and enjoy!

# Setup and Installation:
For this project you will need NPM, a package manager for Node based off of open source coding. This means that programmers can share their projects and code with the public via installable packages. For example: WebSockets, which we will be using to build our chat app.
### Using NPM and Node in the terminal, install WebSockets (ws):
1. run `npm init` in order to connect to NPM
2. Type `node npm install ws --save` and it should install.
    * depending on system preferences, may need to use `sudo` command in the terminal.
    * `ws` is the NPM WebSocket package name: `https://www.npmjs.com/package/ws`
    * `-- save` is used to permanently save the package to your computer. Therefore, you will not need to run `npm install` again.

### What are WebSockets?
1. A WebSocket is an open interactive communication between a user's browser and a server.
2. They allow for a client to send information to a server, that information gets processed by that server then sent out to a new client. Starting to sound familiar? Maybe like a way to communicate or chat?
3. This is the package that we will be using in order to create our chat app. Think of this as the foundation.

### Setting up HTML/CSS
* Before we get knee deep in code we have to set up a bare bones HTML file. The client side will depend on selecting parts of our HTML. If that doesn’t make sense, no worries, we will explain more below.
* Within the body of your HTML file create separate 3 DIV elements, you’ll want to give them ID’s. DIVs should be for a send button, placeholder which will show the client’s input, and an area for displaying the text of the conversation. 

Let’s think about this project before we fully delve in. What is a chat app? On the simplest level it is exactly what we explained above with WebSockets. A means for more than one client to connect to each other through a server. We are going to use the “ws” package we installed to build a program that can contain unlimited clients that connect to a server. We will walk you through step by step on how to write both sides. We will even give you some challenges for how to create special functions within your app. Ready to go?


# Building your Client.js File 
Double check to make sure all the right packages are installed before you start any actual coding. Revisit the “Installation” section for more information.

### Declare a host

We have to write a line of code that will find and connect to a specific server. To host your chat app live, we must declare a variable calling that specific url.

`    var ws = new WebSocket(`server url`);`

When you first begin you may want to host your chat app locally. This will allow you to test your code without having to push updated versions to your server or github. That line of code should look a little like this.

    var ws = new WebSocket('ws://localhost:3000'); 

Create an event listener which will listen for when the page is open or connected to a server. 

    ws.addEventListener(‘open’, function(evt){
        // Almost all of your code will go in here
    });

In order to set up the basics for your chat app you will need to use DOM manipulation. We already set up a bare bones HTML file. So you will either need to be creating new elements through DOM manipulation or selecting them. For example to target the submit button in your html you may write something similar to the following:

    var submitButton = document.querySelector('button');
                    
What information are you storing about your client? We will be using objects to store multiple key/value pairs (hashes). Let's keep it simple and just transfer a name and text between users.

    var object = {
        name: name,
        text: yourInputBoxElement.value,
    }

Wait, we can't send Objects the way they are formatted. So how do we send information? JSON. JSON (JavaScript Object Notation) is just a simple way to interchange data. Clients can only send data in the form of strings, JSON is able to break code down and represent it in the form of objects with key/value pairs, hashes or arrays. There are two main commands for the sending and receiving data through JSON:

* Stringify
    * The stringify method alters objects into strings so that data can be transmitted and received. Again, clients can only send data in the form of strings that can be read by the server.
    * Once an object has been stringified it can be sent by the client to the server using ws.send (more on that later).
* Parse
    * The server has not received stringified data from the client, but now we need to send that data out to the next client as an object.
    * We use the parse method to turn our string back into an object and send it out.
    * And once the client receives the data, the whole process of stringify and parse starts over again.

    var stringified = JSON.stringify(object);
    var parsed = JSON.parse(object);

### Sending Information
1. Create an event listener which will listen for an action. For example, you may use a query selector and target the button you created for the user to click when submitting their text
2. When this event is triggered it will run a function which should include a `send` method.
3. In this case, userMessage, will be a stringified object.
4. The values within the object are text which was grabbed from an input box (which we created in our HTML) the moment the submit button was clicked.
5. What does this mean? This about the first step of writing in a chat app. We open our app, type into and input box, and click send.

    button.addEventListener('click', function(){
        var object = {
            name : name,
            text : YourInputBox.value,
        };

        var userMessage = JSON.stringify(object);
        ws.send(userMessage);
    });

### Receiving Information
1. The event listener in this scenario will be "message." Whenever a message is received by the client, the file will run a function.
2. The goal is to use stringify and parse in both the client and server JS files. For example, the server should be parsing and storing some of the information which has been sent, such as keeping a history of the chat, to share with new users. The server would then stringify and send the information back out to the new clients.
3. Receiving messages will always need to be parsed for the server to be able to read them. Once parsed you can determine what to do with the values in the object:

    ws.addEventListener('message', function(x){
        var parsed = JSON.parse(x.data);
        var paragraph = document.createElement('span');
        var userbubble = document.createElement('div');
        var lineBreak = document.createElement('br');
        paragraph.innerText = parsed.name + ": " + parsed.text;
        paragraph.appendChild(lineBreak);
        userbubble.appendChild(paragraph);
        ChatBoxDiv.appendChild(bubble);
    });

# Building Your Server.js File
Now that we have a super fancy functional client, we need a server so we can actually run our app. Remember all messages need to be sent through a server. Without this we have nothing. Let's begin by creating and opening a server.js file. We need to first declare a WebSocket server object using the same ws package. We are declaring the variable for the actual server:

    var WebSocketServer = require("ws").Server;
    var server = new WebSocketServer({port : 3000});

`port:3000` is simply telling the server which port to listen on. This is important for when we get to the hosting stage.

The server will need to maintain a list of all connected clients. Let's go ahead and create a new variable called clients. This will be an empty array.

    var clients = [];
                
We need an event listener for the event of each client connecting to the server. This is what it's all about; it's basically what the server is for. All the other code will go inside this event listener.

    server.on('connection', function(ws) {
    });

While the WebSocket connection is up, we want to perform three tasks: (1) add the new client to the server-maintained clients array, (2) listen for a WebSocket connection closing, and (3) listen for a message from a WebSocket client and broadcast it.
1. Add the new client to the server-maintained clients array.

    server.on("connection", function(ws) {
        clients.push(ws);

2. Listen for a WebSocket connection closing.

        ws.on("close", function() {
            var x = clients.indexOf(ws);
            clients.splice(x,1);
            console.log("Clients connected: " + clients.length);
        });

3. Listen for a message from a WebSocket client and broadcast it.

        ws.on("message", function(input) {

As mentioned above, we need to use JSON to parse the input, translating it from a string to an object.

            processedInput = JSON.parse(input);
            console.log(processedInput.name + " : " + processedInput.text);

Finally, we step through each client in the client list and send the message to each of them.

            for (i = 0; i < clients.length; i++) { 
                clients[i].send(input);
            }
        });

Everything together looks like this:

    server.on("connection", function(ws) {
        clients.push(ws);
        ws.on("close", function() {
            var x = clients.indexOf(ws);
            clients.splice(x,1);
            console.log("Clients connected: " + clients.length);
        });

        ws.on("message", function(input) {
            processedInput = JSON.parse(input);
            console.log(processedInput.name + " : " + processedInput.text);

            for (i = 0; i < clients.length; i++) {
            clients[i].send(input);
        }
    });

# Git and GitHub
### What is Git and GitHub?
Git is a VCS (Version Control System). Simply put, it’s a timeline for your project but a better way to understand it is like a tree. Your tree works like any other - with a base (master) and branches. With each project you will create a new repository (a project folder) and will be adding, committing, and pushing to that repo. Adding and committing are actions that happen locally (on your computer) but in order to fully save them you need to push everything to GitHub. GitHub is a website where you are saving all these different stages of your code. You can head over and view your code and so can others. Being able to save in stages is important because we all mess up sometimes. You’ll want to be able to go back in time to before the mess up occurred. When this happens - you’ll be using “clone” and “pull”. Branches are cool because they allow you to keep working on your project but in a separate place. Let’s say you want to add some features but aren’t completely confident in the process. Branch off of master (the base) and work away. If the code is a success, you can always “merge” that branch to master later. 

### Let’s break the process down: 
1. Head over to www.github.com and sign up or log in. 
2. Once you are all logged in head over to the top right corner and hit the “+” and select “Create New Repository”. 
What is a repository? Simply put - it’s your projects folder. You are probably going to want to name this one something like “ChatApp”.
3. You have a choice to make this file private or public. You should be making it public. Why make a public repo? This way anyone can access your code! Employers often want to check out good code in GitHub so you’ll want to be able to share this. There’s a lot about cool projects that “made it big”. Who knows? Maybe your chat app will get noticed. 
4. Once you’ve created your new repo you will be taken to an empty project page. Once you have pushed to GitHub, all your files can be accessed here.

### Committing to GitHub
1. Open terminal and make sure you are in your projects folder (directory).
2. Type `git init` - this will get GIT running. 
3. Type `git add .` in order to add all the files in the directory. You don’t have to add everything at once, but this is a great shortcut. 
4. To make the actual commit you will need to type `git commit -m` [some sort of message].
What is committing and how is it different from adding? When you added your files all you did was add them, nothing was really saved. Committing is going to actually save all those files to be accessed later. Remember, nothing is on GitHub yet - this is still only local. Messages are important so that you remember exactly what occurred. Be careful with what words are used in messages, sometimes employers like to check them out. 
1. We need to give our saved files a place to go. Head back to GitHub and copy the SSH link. It will look something like this - `git@github.com:JohnSmith/chatapp.git`
2. In terminal type out `git remote add origin git@github.com:JohnSmith/chatapp.git`
3. Last step - `git push origin master` and you should get some sort of message when this process is completed. 
4. Refresh the project page and all your files, folders, and code should be there.
What exactly is happening here? We are saving our commit to GitHub and telling it that our origin is our base (master). If you were working of branch you would type that branch name instead of master.

# Testing out locally
When you believe your code will function it’s time to test it out.
1. Launch a Terminal window, and run your server code: `node server_code.js`
2. Now in a browser window, type in the address localhost:3000 (or the number of whatever port you designated).
3. This should display your chat app. Type in a line or two of chat.
4. Now open a second browser window and type in the same address. As you type in the two windows, all the chat text should be appearing in both. Check the Terminal window after each new action (client connection/disconnection, new feature test) to ascertain what action (if any) crashes the server.
5. Open up more browser windows, using different browsers and devices. Verify that the chat continues to work.
6. Close each connection and verify that the server is still running and that the remaining connections are open.
Now you’re ready to host the app on the Digital Ocean server.


# Hosting on the Web with Digital Ocean
Digital Ocean(DO) is a server service where you will be able to host your project. The following three items are necessary before starting the hosting steps:
1. Create a Digital Ocean Account
2. Grab the SSH key from the Github repository that contains your chat application. This will connect your javascript server to the DO server. The SSH key can be found on the right hand side of the repo page underneath settings.
3. Finalize your files before pushing to the Github repository. Put all of your files in a single folder, and make sure that folder includes the JSON and WS packages. If it does not, "cd" into that folder on your terminal screen and run the commands "npm init" and "npm install ws --save." Make sure your client.js file is requesting to connect to your digital ocean url, and not to a local host. Now push to the Github repo.

    var ws = new WebSocket('ws://jason.princesspeach.nyc:3000');

            NOT

    var ws = new WebSocket('ws://localhost:3000');
                
### Hosting Steps

1. In your terminal SSH to your DO box by running, "ssh root@yourDOurlname". You should now be inside the DO box on this terminal window
2. From here run the following command to link to the chat app repo on your Github. `git clone yourrepohttpslink`. By doing this, you will be able to use the `git pull origin master` command any time you make a change to the original Github repo.
3. `cd` into the repo folder and run "npm install"
4. Run your chat app's server code by using the "node serverfilename" command. This will turn your DO box into a websocket.
5. Open another terminal window without closing your current one.
6. In the new terminal window SSH to DO and "cd" into the app folder.
7. Run "http-server". This will turn your DO box into a server running the html and css files that are in the folder.
8. By only running "http-server" any connecting users will have to add the port number to the end of the url. For example: "http://yourDOname:8080
9. If you run "http-server -p80" users will be able to connect by using the url without typing in "8080"

#Additional Features
###History
We can configure the chat server so that new clients immediately see the whole history of the chatroom. Add the following lines to the server code:

    var history = [];

We declare an array variable called history. Each element is an object of chat communication -- a username and a string of text.

The next line goes inside the server.on method’s anonymous function:

    ws.send(JSON.stringify(history));

When a new user connects, they immediately receives the chat history up to that point.

Finally, we add a line inside the ws.on section, when the server receives a new message from a user

    history.push(processedInput);

This code adds the latest message to the chat history.

# Congratulations On Your Victory!