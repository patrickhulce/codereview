Code Review for CIS120
======================

Web application to assist with grading homeworks and assessing code style.

Dependencies
------------

1.  Python
2.  flask

Installing Code Review
-------------------

    # Install python and flask if you haven't already
    sudo apt-get install python
    sudo pip install flask
    
    # Download and setup the directories
    git clone https://github.com/patrickhulce/codereview.git
    cd codereview
    mkdir data
    mkdir data/_projects
    
    # Run Code Review
    python app.py

Open your browser to localhost:8000 and enjoy!

Usage
-----

### Overview

Code Review operates on the idea of assignments. An assignment is presented in Code Review by a JSON file that describes the basic settings (people, files, problems, templates, etc) and the comments themselves. 

### Workflow

The basic workflow of Code Review involves the following steps.

1.  Enter your student information under Settings > People
2.  Enter each problem and its corresponding file under Settings > Files
3.  (Optional) Enter the issues you expect to see under Settings > Issue Templates
4.  Copy your students' code into the data folder you created during the installation step in a subfolder bearing the assignment's name. For example, if you're grading an assignment called `lab01` put each student's code into a `codereview/data/lab01/studentid` folder.
5.  Enter the name of the assignment (make sure this matches the folder name you used in step 4) under Settings.
6.  Make your comments (see Making Comments for details).
7.  Edit your email template under Settings > Email Templates
8.  Make your grades for each student under Email.

### Loading/Saving

Because the assignment contains not only the settings, but the comments themselves. __Code Review automatically saves your assignment to `data/_projects/assignment_name.json` every minute__. Please note that if you start a new assignment and change the name to an assignment you already have saved without clicking `Load` _your old assignment will be overwritten_. For safe importing of a project see [Importing/Exporting](#importingsaving).

### Importing/Exporting

In the settings tab, there is a textbox with import and export buttons. Pressing `Export` will populate the textbox with the JSON string of the current value of the assignment, allowing for easy sharing of issue templates, people, and files. Pressing `Import` will parse the text in the textbox and set the value of the people, files, templates, and comments accordingly. __This is currently the safest way to load assignments from a previous session__.

### Making Comments

After you've entered the necessary settings and copied the files into the `data/assignment_name` folder, you're ready to start commenting on the code. Start by opening the `Code` tab, selecting a student's name, and selecting a file. The student's file should appear in the code pane on the left. Now click on a problem to get started. A tabbed interface should appear on the right. The `General` section is where you'll mark the student's overall style in solving the given problem as well as his or her test coverage by using the radio buttons. The `Issues` section is where you'll provide comments on specific errors or style violations that could be improved. To assist in making comments, common issues can be automatically filled in by starting to type the name of the issue template and hitting enter once the name is highlighted. This will automatically populate the description and severity based on the corresponding issue template. After making the necessary comment, be sure to click `Add` to add the comment to the assignment.

Settings
--------

### People

Each assigment contains a set of people we expect to review. Three attributes need to be known about a person: their id (used for retrieving their code from the `data/assignment_name/studentid` folder), their name (used in the email template), and their email (used for the mailto link when sending out grades).

### Files

Each assignment contains a set of files we expect to review. Each student's files must be located at `data/assignment_name/studentid/filename` in order to be pulled up by Code Review.

### Problems

Each file contains a set of problems we expect to review. Each problem contains a friendly name, which is used for navigation within Code Review and for displaying in student comments, and a signature, which is used to automatically navigate to the relevant code block when reviewing a file. When filling out the signature, it is wise to include the minimum text that is likely to be common to all students' implementations. Currently, any spaces are replaced with RegEx that will match between 0 and 4 spaces, and any use of the `rec` keyword will be replaced with RegEx that optionally matches against it.

### Issue Templates

Each assignment contains a set of issue templates that can be used to automatically fill in the description and severity of code problems that are likely to be common across many students. When actually making comments, autocomplete will match against any word in the name or description.

