// JavaScript File: twitchTaskboardBot.js
// This project uses tmi.js library for Twitch chat integration.
// tmi.js is a third-party library developed and maintained by its respective authors.
// This project has been made solely by me, it took me 2-3 hours to make, hope you have fun using it!

// Authentication and channel information
const auth = (function () {
    const channel = "[TwitchUsername]"; // Your channel
    const username = "[BotUsername]"; // Bot account or your channel
    const oauth = "[TwitchAuthentification Token]"; // Your OAuth token

    return {
        channel,
        username,
        oauth,
    };
})();

// Initialize Twitch client
const client = new tmi.Client({
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: auth.username,
        password: auth.oauth
    },
    channels: [auth.channel]
});


// Parse commands from chat messages
client.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot itself

    // Parse command
    const args = message.split(' ');
    const command = args[0];

    // Process commands
    switch (command) {
        case '!addtask':
            addTask(tags.username, args.slice(1).join(' '));
            break;
        case '!finishtask':
            finishTask(tags.username, parseInt(args[1]));
            break;
        case '!deletetask':
        case '!deltask':
            deleteTask(tags.username, parseInt(args[1]));
            break;
        case '!edittask':
            editTask(tags.username, parseInt(args[1]), args.slice(2).join(' '));
            break;
        default:
            break;
    }
});

// Connect to Twitch IRC
client.connect().catch(console.error);


// Function to clear all tasks and username containers on the board
function clearTaskboard() {
    // Clear all tasks and username containers from the taskboard data structure
    Object.keys(taskboard).forEach(username => {
        delete taskboard[username];
    });

    // Update the taskboard display
    displayTaskboard();
}

// Command handler for the !clear command
function handleClearCommand(channel, tags) {
    // Check if the user issuing the command is a moderator or the streamer
    if (tags.mod || tags['user-id'] === tags['room-id']) {
        // Clear the taskboard
        clearTaskboard();
        client.say(channel, `@${tags.username}, Taskbar has been cleared!`);
    } else {
        // Inform the user that they are not authorized to use the command
        client.say(channel, `@${tags.username}, you are not authorized to use this command.`);
    }
}

// Register the command handler for the clear commands
client.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot itself

    const args = message.split(' ');
    const command = args[0];

    switch (command) {
        case '!cleartasks':
        case '!clear':
        case '!cleartaskboard':
            handleClearCommand(channel, tags);
            break;
        // Handle other commands...
        default:
            break;
    }
});


// Function to add a task
function addTask(username, taskName) {
    if (!taskboard[username]) {
        taskboard[username] = [];
    }
    taskboard[username].push(taskName);
    displayTaskboard();
    storeTasksAsCookie(); // Add this line
    client.say(auth.channel, `@${username}, task "${taskName}" has been added!`);
}



// Function to finish a task
function finishTask(username, index) {
    if (taskboard[username] && index >= 1 && index <= taskboard[username].length) {
        const taskIndex = index - 1; // Adjust for 0-based indexing
        const taskContent = taskboard[username][taskIndex];
        if (!taskContent.startsWith('<del>') && !taskContent.endsWith('</del>')) {
            // If task content doesn't already have <del> tags, add them
            taskboard[username][taskIndex] = `<del>${taskContent}</del>`;
        }
        displayTaskboard(); // Update taskboard display
        storeTasksAsCookie(); // Add this line
    }
    client.say(auth.channel, ` Congratulations @${username}, On Completing "${taskName}"!`);
}



// Function to mark task as completed
function markTaskAsCompleted(username, index) {
    const taskElements = document.querySelectorAll('.task');
    taskElements.forEach((taskElement, i) => {
        if (i === index && taskElement.parentNode.parentNode.querySelector('.username').textContent === `@${username}'s Taskboard`) {
            taskElement.classList.add('completed'); // Add completed class
            // Optionally, you can also apply the line-through style directly here
            taskElement.style.textDecoration = 'line-through';
        }
    });
}

// Function to delete a task
function deleteTask(username, index) {
    if (taskboard[username] && index >= 1 && index <= taskboard[username].length) {
        const taskIndex = index - 1; // Adjust for 0-based indexing
        taskboard[username].splice(taskIndex, 1);
        displayTaskboard();
        storeTasksAsCookie(); // Add this line
    }
    client.say(auth.channel, `@${username}, the task "${taskName}" has been`);
}



// Function to edit a task
function editTask(username, index, newTaskName) {
    if (taskboard[username] && index >= 1 && index <= taskboard[username].length) {
        const taskIndex = index - 1; // Adjust for 0-based indexing
        taskboard[username][taskIndex] = newTaskName;
        displayTaskboard();
        storeTasksAsCookie(); // Add this line
    }
}

// Function to display the taskboard in chat
function displayTaskboard() {
    const taskboardElement = document.getElementById('taskboard');
    taskboardElement.innerHTML = ''; // Clear previous content

    Object.keys(taskboard).forEach(username => {
        const usernameElement = document.createElement('div');
        usernameElement.classList.add('username');
        usernameElement.textContent = `${username}'s Tasks`;
        taskboardElement.appendChild(usernameElement);

        taskboard[username].forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            if (task.startsWith('<del>') && task.endsWith('</del>')) {
                taskElement.classList.add('completed'); // Add completed class
                // Remove <del> tags to display the task without strikethrough
                task = task.substring(5, task.length - 6);
            }
            taskElement.innerHTML = `<span class="index">${index + 1}.</span> ${task}`;
            taskboardElement.appendChild(taskElement);
        });
    });
}



// Command handler for the !by command
function handleByCommand(channel) {
    const message = "Made by ValenziaTTV. Follow her at https://www.twitch.tv/valenziattv";
    client.say(channel, message);
}

// Register the command handler for the !by command
client.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot itself

    const args = message.split(' ');
    const command = args[0];

    switch (command) {
        case '!taskby':
            handleByCommand(channel);
            break;
        // Handle other commands...
        default:
            break;
    }
});



// Function to scroll the taskboard content automatically
function scrollTaskboard() {
    const taskboardElement = document.getElementById('taskboard');
    let currentScroll = 0;
    const maxScroll = taskboardElement.scrollHeight - taskboardElement.clientHeight;
    let scrollSpeed = 1; // Initial scroll speed
    let scrollDirection = 'down'; // Initial scroll direction

    // Jump to the top of the taskboard instantly
    taskboardElement.scrollTop = 0;

    // Wait 5 seconds before starting the initial scroll
    setTimeout(() => {
        // Start scrolling down
        scrollDirection = 'down';
        scrollInterval();
    }, 5000);

    // Function to control scrolling
    function scrollInterval() {
        const interval = setInterval(() => {
            if (scrollDirection === 'down') {
                // Scroll down
                currentScroll += scrollSpeed;
                taskboardElement.scrollTop = currentScroll;

                // Check if reached bottom
                if (currentScroll >= maxScroll) {
                    // Wait 5 seconds before scrolling up
                    clearInterval(interval);
                    setTimeout(() => {
                        // Start scrolling up
                        scrollDirection = 'up';
                        scrollInterval();
                    }, 5000); // Wait 5 seconds before scrolling up
                }
            } else if (scrollDirection === 'up') {
                // Scroll up
                currentScroll -= scrollSpeed;
                taskboardElement.scrollTop = currentScroll;

                // Check if reached top
                if (currentScroll <= 0) {
                    // Wait 5 seconds before scrolling down again
                    clearInterval(interval);
                    setTimeout(() => {
                        // Start scrolling down
                        scrollDirection = 'down';
                        scrollInterval();
                    }, 5000); // Wait 5 seconds before scrolling down again
                }
            }
        }, 20); // Adjust scrolling interval as needed (lower values for smoother scrolling)
    }
}

// Start scrolling the taskboard content automatically when the page loads
window.addEventListener('load', () => {
    scrollTaskboard();
});


// Command header text
const headerTexts = ['Commands: !addtask', 'Commands: !finishtask', 'Commands: !deletetask', 'Commands: !edittask', 'Commands: !deltasksuser', 'Commands: !taskby'];
let headerIndex = 0;

// Function to update the header text with fading effect
function updateHeaderText() {
    const headerElement = document.getElementById('header');
    headerElement.textContent = headerTexts[headerIndex];
    headerElement.classList.add('fade-in');

    // Wait 5 seconds before fading out to the next command
    setTimeout(() => {
        headerElement.classList.remove('fade-in');
        headerIndex = (headerIndex + 1) % headerTexts.length; // Move to the next command
        setTimeout(updateHeaderText, 500); // Start the fading effect for the next command
    }, 5000);
}

// Start the fading effect for the header text
updateHeaderText();



// Function to store tasks on the taskboard as a Cookie
function storeTasksAsCookie() {
    const jsonTasks = JSON.stringify(taskboard);
    document.cookie = "TasksLocalStorage=" + encodeURIComponent(jsonTasks);
    console.log("Taskboard data stored in cookie:", taskboard);
}

// Function to retrieve tasks from the Cookie
function retrieveTasksFromCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'TasksLocalStorage') {
            const tasks = JSON.parse(decodeURIComponent(value));
            console.log("Taskboard data retrieved from cookie:", tasks);
            return tasks;
        }
    }
    console.log("No taskboard data found in cookie.");
    return null;
}

// Declare taskboard as a global variable with let
let taskboard = {};

// Function to initialize taskboard with tasks from the Cookie
function initializeTaskboardFromCookie() {
    const storedTasks = retrieveTasksFromCookie();
    if (storedTasks) {
        taskboard = storedTasks; // Assign stored tasks to taskboard
        displayTaskboard(); // Update the taskboard display
        console.log("Taskboard initialized from cookie:", taskboard);
    }
}

// Initialize taskboard from Cookie when the page loads
window.addEventListener('load', () => {
    initializeTaskboardFromCookie();
});








// Function to clear tasks of a specific user
function clearUserTasks(username) {
    if (taskboard[username]) {
        delete taskboard[username];
        displayTaskboard(); // Update the taskboard display
        console.log(`Tasks for user ${username} cleared.`);
        return true; // Indicate successful task clearing
    }
    console.log(`No tasks found for user ${username}.`);
    return false; // Indicate no tasks found for the user
}

// Command handler for the !cleartasksuser command
function handleClearTasksUserCommand(channel, tags, message) {
    const args = message.split(' ');
    const usernameToClear = args[1];

    // Check if the user issuing the command is a moderator or the streamer
    if (tags.mod || tags['user-id'] === tags['room-id']) {
        // Check if a username is provided and clear the taskboard for that user
        if (args.length >= 2) {
            const success = clearUserTasks(usernameToClear);
            if (success) {
                storeTasksAsCookie(); // Store taskboard data after clearing
                client.say(channel, `@${tags.username}, Taskboard for ${usernameToClear} has been cleared!`);
            } else {
                client.say(channel, `@${tags.username}, no tasks found for user ${usernameToClear}.`);
            }
        } else {
            client.say(channel, `@${tags.username}, you need to provide a valid username.`);
        }
    } else {
        // Inform the user that they are not authorized to use the command
        client.say(channel, `@${tags.username}, you are not authorized to use this command.`);
    }
}

// Register the command handler for the !cleartasksuser command
client.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot itself

    const args = message.split(' ');
    const command = args[0];

    switch (command) {
        case '!deltasksuser':
            handleClearTasksUserCommand(channel, tags, message);
            break;
        // Handle other commands...
        default:
            break;
    }
});