var db = require('./modules/sheets.js'); 
 
//db.retrieveAllAnswers('1AoWv5KqCiEUVE3_fsv7QP8vUZvv7UwzSUnkERrSY9wc',false,['Gender','Class Level','Home State','Major','Extracurricular Activity'],function(response){ 
//    console.log(response);}); 
db.storeAnswers('1AoWv5KqCiEUVE3_fsv7QP8vUZvv7UwzSUnkERrSY9wc','Whatbot',['Gender','Class Level','Home State','Major','Extracurricular Activity'],function(response){ 
console.log(response);}); 
//db.createSheet(function(response){console.log(response);});