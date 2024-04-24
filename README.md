**Setting Up the Twitch Taskboard Bot: A Step-by-Step Guide**

In this tutorial, you will learn how to set up the Twitch Taskboard Bot for your Twitch channel. This bot allows you to manage tasks in your Twitch chat using simple commands. Follow these steps to get started:

### Step 1: Download the Bot Files

1. Go to the GitHub repository for the Twitch Taskboard Bot.
2. Click on the green "Code" button and select "Download ZIP".
3. Extract the downloaded ZIP file using software like WinRAR or 7-Zip.

### Step 2: Edit the Configuration

1. Open the `twitchTaskboardBot.js` file in a text editor like Notepad or Notepad++.
2. Locate the following lines of code:

   ```javascript
   const channel = "[TwitchUsername]"; // Your channel
   const username = "[BotUserName]"; // Bot account or your channel
   const oauth = "[TwitchAuthentification Token]"; // Your OAuth token
   ```

3. Replace `[TwitchUsername]` with your Twitch username, `[BotUserName]` with your bot account username or your Twitch channel username, and `[TwitchAuthentification Token]` with your OAuth token obtained from https://twitchapps.com/tmi.

### Step 3: Add Browser Source in Chat

1. Open the `index.html` file in a web browser.
2. Copy the URL of the file and create a new browser source in your streaming software.
3. Set the dimensions of the browser source to 650 pixels height and 500 pixels width.
4. Make sure to refresh the webpage when the file becomes active in the streaming software.

### Step 4: Add Pre-made Task Examples (Optional)

1. At the end of the `twitchTaskboardBot.js` file, add the following code:

   ```javascript
   // Function to add pre-made task examples
   function addPreMadeTasks() {
       addTask(auth.username, "Example Task 1");
       addTask(auth.username, "Example Task 2");
       addTask(auth.username, "Example Task 3");
   }

   // Add pre-made task examples when the page loads
   window.addEventListener('load', () => {
       addPreMadeTasks();
   });
   ```

2. This will add three pre-made task examples to the taskboard when the page loads.

### Step 5: Customize CSS (Optional)

1. Open the `styles.css` file in a text editor.
2. Customize the CSS styles to fit your overlay. Each part of the CSS file is annotated to help you understand what each style does.

### Step 6: Use Commands in Chat

1. You can now use the following commands in your Twitch chat:
   - `!addtask (Task Name)`: Add a new task to the taskboard.
   - `!edittask (Index Number) (New Task Name)`: Edit an existing task on the taskboard.
   - `!finishtask (Index Number)`: Mark a task as completed on the taskboard.
   - `!deletetask (Index Number)`: Delete a task from the taskboard.
   - `!cleartasks`: Clear all tasks from the taskboard (Moderator only).
   - `!deltasksuser`: Deletes all the tasks for one user (Moderator only).
   - `!taskby`: Show who made the bot.

### Step 7: Enjoy Using the Bot!

Congratulations! You have successfully set up the Twitch Taskboard Bot for your Twitch channel. Now you can efficiently manage tasks and interact with your audience using simple chat commands. Enjoy using the bot and enhancing your Twitch streaming experience!