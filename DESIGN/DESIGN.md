# WhatBot - A standup emulation bot

### **Problem Statement**

Stand-up meeting is an integral part in any technology project team. Everyday each team member  answers a set of questions viz. what they’ve been working on, what’s next and any problems being faced etc. 

Now, imagine a team of 10 members. The project manager asks the same set of questions to each member sequentially . Assuming that each team member takes about 2-3 mins to answer the questions asked by the Project Manager. Hence, the Stand-up meeting would take minimum of 20 mins. 

How about automating this using a bot? Everyday, at a particular time, the bot asks the same pre-defined set of questions to all the team members simultaneously. The bot can gather the answers of all the team members answers, consolidate them into a report and share it with all stakeholders. This approach provides flexibility to the employees, as they can read the updates as per their convenience, or skip the updates they are not interested in. This helps in saving considerable time.

Another case is when the project manager or team member is not in office, and cannot attend the stand-up. The bot will help enable information dissemination as if the whole team were physically present for the meeting. Also if some stakeholder is on leave of absence, the consolidated email will help keep the stakeholder updated as to what happened when he/she was away.


### **Bot Description**

We propose to deploy a documentation bot that interacts with team members, records their updates, and generates a consolidated email which is sent to all stakeholders.

#### Bot Features:
* Creation of online standup meetings  
* Daily standing meeting emulation  
* Standup meeting report generation  

#### Bot Design Considerations:

* How are multiple standups within the same slack group handled?  
A new bot should be created for every standup.

* How does the bot interact with each participant?  
The bot directly messages the participant on slack at the configured time on all configured days. This eliminates the creation of a common channel solely for the purpose of conducting standup, and prevents all participants from getting a notification every time someone posts an update. 

* How are participants added to or removed from a standup?  
The creator has the following options while selecting users to be added/removed:
	1. Select specified users.
	2. Select specified user-groups.
	3. Select all users from the specified channel.
	4. Select all users from the slack group.

* What set of questions will the bot ask for each standup?  
The creator can either use the default set of questions (What did you do yesterday? What will you do today? Is there anything blocking you?), or define his own questions.

* When will these questions be asked?  
Standup days and time window need to be configured by the creator. 
For each standup day, the bot will start the standup session with each participant at the configured start time, and share all updates at the configured end time. The standup will close after the end time, and no responses will be recorded after that. If the user fails to respond during the window, his updates will be empty for that day. There will be an option to configure a reminder for users who haven’t posted their updates, before the standup closes.

* How is the standup report shared with everyone?  
For now the standup is shared with all participants through a consolidated email.
In future, we may allow the creator to configure other options such as a custom channel, or hosting it online on a website.

* Which standup configurations can be edited later?  
For now, we are enabling editing for the set of questions, standup schedule, and participants. In future, we may add the option to edit the standup report delivery method.

* Is there a way to filter out standup updates for a participant for a specified date range?  
No. This feature is out-of-scope for now.

#### User interaction:
Whatbot will understand basic chat commands to perform the following operations.
```
Schedule a new standup or move an existing one: schedule standup  
Whatbot will then prompt for entering the days, duration, participants, and question set.	 

Schedule a reminder for x minutes prior to the report submission:  reminder [x], set reminder [x], etc
If the user has not supplied the time, Whatbot will prompt for it.
	
Modify participants: add/remove participant [participant-list]
The participant-list can be a combination of the following:
	1. list of users: @<user1>, ..., @<userN>
	2. specific user group: @<user-group-name> 
	3. specific channel: #<channel-name>
	4. all users from the slack group: all
If the user has not supplied the partcipant-list, Whatbot will prompt for it.

Cancel the standup for today: cancel standup
(for deleting the standup, delete the bot)	 

Pause standup for x days: pause standup [x], pause standup for <x> days, etc
If the user has not supplied the days, Whatbot will prompt for it.
	
Resume a standup that has been paused: resume standup

Show when the standup is scheduled for: show schedule

Skip answering a question during standup: skip

Replace all standup questions with a new set of questions: modify | update | change | replace questions questions	
```

### **Use Cases**
#### 1) Create a new standup

Preconditions: None

Normal flow:
1. User selects the option to create a new whatbot in the slack group.
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
1. Whatbot will inform the user that the standup has started.
2. Whatbot will prompt the user to respond when ready.
3. User responds to the start message.
4. Whatbot will ask a question.
5. User will respond to the question, or enter the skip question command.
6. Steps 4 and 5 are repeated till all configured questions have been asked.
7. User is asked if he wants to redo all the questions, or submit his answers.
8. User proceeds with submit.
9. Whatbot notifies the user that his responses have been saved.

Alternative flows:  
8A. User decides to redo all questions.  
	1. Whatbot indicates to the user that the process will be repeated.  
	2. The use case returns to step 4.  



#### 3) Edit the configuration of an existing standup

Preconditions: Standup to be edited exists.

Normal flow:  
[Subflow 1]. User wants to edit the standup schedule.  
	i. User sends a command to the Whatbot to modify the standup duration.  
   	ii. Whatbot asks the user to provide a new schedule.  
   	iii. User responds with a set of days and the time window.  
   	iv. Whatbot confirms the new schedule.  

[Subflow 2]. User wants to add/edit a reminder before the standup closes.  
	i. User sends a command to the Whatbot to modify the reminder.  
	ii. Whatbot asks the user to provide a new time for the reminder.  
	iii. User responds with a new time for the reminder.  
	iv. Whatbot confirms the new reminder time.  

[Subflow 3]. User wants to edit the participants for the standup.  
	i. User sends a command to the Whatbot to add/remove participant(s).  
	ii. Whatbot prompts for a list of participant(s).  
	iii. User responds with the list of participant(s).  
	iv. Whatbot acknowledges the changes.  

[Subflow 4]. User wants to edit the standup questions.  
	i. User sends a command to the Whatbot to modify questions.  
	ii. Whatbot asks the user to provide a new set of questions.  
	iii. User responds with the new questions.  
	iv. Whatbot confirms the new questions.  

Alternative flows:  
[S1, S2, S3, S4] If the user enters an invalid input then the Whatbot responds with an error message and terminates the subflow.


### **Design Sketches**
**Wireframe**


 __**Storyboard**__

![storyboard 2](https://media.github.ncsu.edu/user/6391/files/d170a57a-9fbf-11e7-9d72-cb247dac658e)

### **Architecture Design**

#### **Constraints**  
* There isn't a need to invite the bot to any channel. 
* A single bot handles a single standup. A new standup would be handled by a new instance of the bot.
* Every user interacts through direct messages with the bot and not through a dedicated channel.
* Only the creator of the bot can modify the configurations of the bot.
	
