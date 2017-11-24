# Deployment

### Screencast 

Deploy : https://youtu.be/QSpcJWYnb5A

### User Acceptance Tests

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


