#### All our tasks are being tracked through the Trello platform. [Here](https://trello.com/b/xPCqntUz/milestone3) is the link to the Trello Cards.


# Worksheet

## Milestone 3 : SERVICE

### Week 1 : 30th Oct to 5th Nov  
  
|   | Deliverable    | Tasks | Issues | Team Members  | Estimated Date | Actual Date |
|---|----------------|-------|--------|---------------|----------------|-------------|
| 1 | Standup config | Add help feature, so the user understands how to interact with the bot |  | Sharmin, Ronald | 5th Nov | 5th Nov |
|   |                | Add show feature, so the user can see the configured standup parameters | | Sharmin, Ronald | 5th Nov | 5th Nov |
| 2 | Standup session| Redo standup                |  | Calvin, Nirav  | 5th Nov | 5th Nov |
|   |                | Fetch standup parameters from config object instead of mock file |  | Sharmin, Ronald | 4th Nov | 5th Nov |

### Week 2 : 6th Nov to 11th Nov   

|   | Deliverable    | Tasks | Issues | Team Members  | Estimated Date | Actual Date |
|---|----------------|-------|--------|---------------|----------------|-------------|
| 1 | Standup config | Fetch config from the config file when the bot is restarted |  | Sharmin, Ronald | 8th Nov | |
|   |                | Create Google Sheet for the bot and save the access info in the config | | Bharat, Calvin | 8th Nov |  |
|   |                | Verify that the standup participants configured are valid users, and fetch all users if a channel name is given (Replace mocking with slack API calls) |  | Sharmin, Ronald | | |
|   |                | Verify that the reporting channel is valid, and that the bot is a member of the channel |  | Sharmin, Ronald | | |
| 2 | Standup session| Store the standup answers on google sheets |  | Calvin, Nirav  | | |
|   |                | Modify conversation to loop over all configured questions |  | Sharmin, Ronald | | |
|   |                | Trigger the standup scheduling function after the standup is configured or after loading config from config file. Reschedule it whenever the standup start time is modified. |  | Sharmin, Ronald | | |
| 3 | Reporting      | Trigger report generation at standup end time. Reschedule it whenever the standup end time is modified. |  |  Bharat     | | |
|   |                | Retrieve standup answers from google sheets and compile standup report |  | | | |
| 4 | Code Integration | Integrate index.js and main.js and divide code modules into different files |  | Sharmin, Ronald, Nirav | | |
| 5 | Reporting      | Email standup report        |  | Calvin, Nirav  | | |

### Week 3 : 12th Nov to 14th Nov   

|   | Deliverable    | Tasks | Issues | Team Members  | Estimated Date | Actual Date |
|---|----------------|-------|--------|---------------|----------------|-------------|
| 1 | Selenium testing | Add show and help commands to use case 1. Add cases for invalid channel and participants. |  |Sharmin, Ronald | | |
|   |                  | Modify use case 2 to show google sheets integration |  | | | |
| 2 | Screen cast      | Use case 1                                  |  |   |  |   |
|   |                  | Use case 2                                  |  |   |  |   |
|   |                  | Use case 3                                  |  |   |  |   |
