# WhatBot - A standup emulation bot

### **Problem Statement**

Stand-up meeting is an integral part in any technology project team. Everyday each team member  answers a set of questions viz. what they’ve been working on, what’s next and any problems being faced etc. 

Now, imagine a team of 10 members. The project manager asks the same set of questions to each member sequentially . Assuming that each team member takes roughly about 2 mins to answer the questions asked by the Project Manager. Hence, the Stand-up meeting would take minimum of 20 mins. 

How about automating this using a bot? Everyday, at a particular time, the bot asks the same pre-defined set of questions to all the team members simultaneously. Thus, the bot can gather all the team-member’s answers in just 2mins. It can consolidate all the answers into a report and share it with all stakeholders. This approach provides flexibility to the employees, as they can read the updates as per their convenience, or skip the updates they are not interested in. This helps in saving considerable time.

Another case is when the project manager or team member is not in office, and cannot attend the stand-up. The bot will help enable information dissemination as if the whole team were physically present for the meeting. Also if some stakeholder is on leave of absence, the consolidated email will help keep the stakeholder updated as to what happened when he/she was away.


### **Bot Description**




### **Use Cases**
#### 1) Create a new standup

Preconditions: None

Normal flow:
1. User selects the option to create a new standup bot in the slack group.
2. User supplies a unique name for the bot. (Bot name is the same as the standup name)
3. User adds participants to the standup.
4. User configures the standup duration. (time when standup begins, time when the standup is closed and shared with with all participants)
5. User accepts the default standup questions. 
6. The bot indiactes to the user that a new standup has been created. 

Alternative flows:  
2A. The bot name is not unique.  
	1. Slack will prompt the user to select a different bot name.  
	2. The use case continues.  

5A. The user does not accept the default standup questions.  
	1. User supplies his custome standup questions.  
	2. Use case returns to step 6.  


#### 2) Standup session with a user

Preconditions: It's time for starting the standup.

Normal flow:  
1. Standup bot will inform the user that the standup has started.
2. Standup bot will prompt the user to respond when ready.
3. User responds to the start message.
4. Standup bot will ask a question.
5. User will respond to the question, or enter the skip question command.
6. Steps 4 and 5 are repeated till all configured questions have been asked.
7. User is asked if he wants to redo all the questions, or submit his answers.
8. User proceeds with submit.
9. Standup bot notifies the user that his responses have been saved.

Alternative flows:  
8A. User decides to redo all questions.
	1. Standup bot indiactes to the user that the process will be repeated.
	2. The use case returns to step 4.



#### 3) Edit the configuration of an existing standup

Preconditions: Standup to be edited exists.

Normal flow:  
[Subflow 1]. User wants to edit the standup duration.  
	i. User sends a command to the Standup bot to modify the standup duration.  
	ii. Standup bot asks the user to provide a new duration.  
	iii. User responds with the new duration in minutes.  
	iv. Standup bot confirms the new duration.  

[Subflow 2]. User wants to add/edit a reminder before the standup closes.  
	i. User sends a command to the Standup bot to modify the reminder.  
	ii. Standup bot asks the user to provide a new time for the reminder.  
	iii. User responds with a new time for the reminder.  
	iv. Standup bot confirms the new reminder time.  

[Subflow 3]. User(admin) wants to edit the participants for the standup.  
	i. User(admin) sends a command to the Standup bot to modify the members in the standup group.  
	ii. Standup bot asks the user(admin) wants to add or delete a participant.  
	iii. User(admin) responds with the name of the participant.  
	iv. Standup bot confirms the new participant.  

[Subflow 4]. User(admin) wants to edit the standup questions.  
	i. User(admin) sends a command to the Standup bot to modify questions.  
	ii. Standup bot asks the user(admin) to provide a new set of questions.  
	iii. User(admin) responds with the new questions.  
	iv. Standup bot confirms the new questions.  

Alternative flows:  
[S1, S2, S3, S4] If the user enters an invalid input then the Standup bot responds with an error message and terminates the subflow.



### **Design Sketches**
* **Wireframe**




* __**Storyboard**__

![storyboard](https://media.github.ncsu.edu/user/6391/files/72a676a2-9f9f-11e7-9afa-835033b141c8)




### **Architecture Design**

#### **Constraints**  

1. Slack: 
	* There isn't a need to invite the bot to any channel. 
	* A single bot handles a single standup. A new standup would be handled by a new instance of the bot.
	* Every user interacts through direct messages with the bot and not through a dedicated channel.
	* Only the creator of the bot can modify the configurations of the bot.
	
2. Email:
	* The collected standup information is not persistent since the bot consolidates all the reports internally and discards the data after sending emails to all stakeholders.
	
