CODE -> https://github.ncsu.edu/nedsouza/CSC510-Project/tree/master/SERVICE/Code

### Services  

Emailing reports: We used nodemailer module to integrate with Google's GMail API to effectively send email reports to the end users. 
Storing standing responses: 

Modules:  
main.js - handles the conversation between the bot and the user for all 3 use cases  
config.js - has helper functions and data for storing and modifying the standup config  
standup.js - has helper functions and data for conducting a standup session with each participant  
report.js - has helper functions for report compilation and sharing  

### Selenium Testing  
Please find the Selenium test Maven folder [here](Selenium).  
There are 3 files:   
1. [UseCase 1](https://github.ncsu.edu/nedsouza/CSC510-Project/blob/master/SERVICE/Selenium/src/test/java/NewStandupConfigTest.java) tests usecase 1 which initiates a new standup configuration     
2. [UseCase 2](https://github.ncsu.edu/nedsouza/CSC510-Project/blob/master/SERVICE/Selenium/src/test/java/StandupSession.java) tests the conversation between the user and the bot and also reporting.  
3. [UseCase 3](https://github.ncsu.edu/nedsouza/CSC510-Project/blob/master/SERVICE/Selenium/src/test/java/EditStandupConfigTest.java) tests the edit configuration usecase.    


### Stories, Tasks, and Task Tracking  

https://trello.com/b/xPCqntUz/milestone3  
https://github.ncsu.edu/nedsouza/CSC510-Project/blob/master/SERVICE/WORKSHEET.md

### Screencast
Please find the screen casts below:
1. [Creating a new standup]()  

2. [Standup session with a user]()

3. [Editing an existing standup]()
