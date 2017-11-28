# Deployment

### Environment

![image](https://media.github.ncsu.edu/user/6391/files/3ee4b664-d238-11e7-8640-20c53ac9515b)

### Pre-requisite
* Ubuntu trusty 14.04 Vagrant VM(192.168.33.10) that acts as Configuration Manager
* The Configuration Manager has ansible 2.4.1.0 installed
* AWS account
* 1 elastic Ip address reserved
* The .pem file (required for ssh into EC2) has been chmod 600
* Robot Framework 3.0.2 installed on host machine(in this case windows 10). This is required to automate the bot authorization after the two playbooks have been executed
* Has Selenium2 library imported

### Steps to deploy the slack bot onto an EC2 instance
* run **provisionAws.yml** ansible playbook as below
              
             ansible-playbook provisionAws.yml
             
***The provisionAws.yml ansible playbook will check if the EC2 instance with the reserved Elastic IP address exists. If it does, it will terminate the instance and launch a new instance(Ubuntu Trusty 14.04). Attach the resered elastic Ip address to the new EC2 instance and try to do ssh to verify and confirm if the new EC2 instance has been baked successfully.*** 

* run **WhatBot.yml** ansible playbook as below

            ansible-playbook -i inventory WhatBot.yml

***The WhatBot.yml ansible playbook will install all the dependencies and packages required to run WhatBot application onto EC2 instance at port 4500. The inventory file of WhatBot consists of the elastic Ip address of the Ec2 instance and the .pem file.***

* run **BotAuthorization.robot** as below

            pybot BotAuthorization.robot            or
            robot BotAuthorization.robot            or
            Run it directly form PyCharm IDE after having Robot Framework integrated with it

***The BotAuthorization.robot consists of a Selenium test that does authorization of the bot***

### Screencast 

Deploy : https://youtu.be/QSpcJWYnb5A

Usecase : https://youtu.be/G1LQQv0Re1k

**********************************************************************************************************************

# User Acceptance Tests

##### Test Requirements

To run this tests, we have created 2 Slack users and their credentials are as follows.

``` email: guest1.whatbot@gmail.com password: 12345ABCDE ```

The user needs to login to our slack team by visiting the [Slack page](https://parkwoodgang.slack.com/)  
![Login Image](./UAT/PreTest-login.jpg)

##### Pre UseCase Steps:

* Login to [authenticate](http://54.156.253.240:4500/login) here to get the standup configured.  

![Authenticate](./UAT/PreUseCase-Auth1.jpg)  
  
* Enter **parkwoodgang**  as the team name and select **continue**  

![Team Name](./UAT/PreUseCase-Auth2.jpg)  
  
* You then need to signin using one of the credentials provided above  
  
![Sign In](./UAT/PreUseCase-Auth3.jpg)  
  
* You then need to click on **Authorize**  
  
![Authorize](./UAT/PreUseCase-Auth4.jpg)  
  
* You will then get the success screen  
  
![Success](./UAT/PreUseCase-Auth5.jpg)  
  
##### Use Case 1:
* Login to the slack team [website](https://parkwoodgang.slack.com/).  
  
  ![Login Image](./UAT/PreTest-login.jpg)
  
* You will see a new message from Whatbot
    
![Post Authentication](./UAT/UseCase1-PostAuth.jpg)
  
* You can go ahear and begin the setup  
  
![Setup](./UAT/UseCase1-Setup.jpg)  
  
* Select the time you want the standup to begin
  
![Start Time](./UAT/UseCase1-StartTime.jpg)
  
* Select the time you want the standup to end
  
![End Time](./UAT/UseCase1-EndTime.jpg)

* Select the users you want to participate in the standup
    
![Users](./UAT/UseCase1-User.jpg)

* Select the questions. You can cheeose the default question set or make your own.

![Own Question Set](./UAT/UseCase1-questions.jpg)
  
* Select the reporting method
  
![Slack Channel](./UAT/UseCase1-Report.jpg)


