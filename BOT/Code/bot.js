var Botkit = require('botkit');
// var Forecast = require('forecast.io');
//var options = {APIKey:process.env.FORECASTTOKEN};
var S_token = "xoxb-255934448881-OeZzEyEaaLhBHPNxJxTnxIgb"
//var forecast = new Forecast(options);

//var childProcess = require("child_process");

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: S_token,
}).startRTM()

// give the bot something to listen for.
//controller.hears('string or regex',['direct_message','direct_mention','mention'],function(bot,message) {
controller.hears('What',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  console.log(message);
  bot.reply(message,"My name is WhatBot");

});
