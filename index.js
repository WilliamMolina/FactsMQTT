/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const mqtt = require('mqtt');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.1bbed508-f3e8-42e5-9cdf-aecaa573e307';

const SKILL_NAME = 'Home Dashboard';
const DEFAULT_SCREEN = 'living room screen' 
const GET_FACT_MESSAGE = "Opening ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const data = [
    {'name':'widget-todays-date', 'description':'Current date'},
    {'name':'widget-hello', 'description':'Your map'},
    {'name':'widget-quotes', 'description' : 'Inspiration quotes'}
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function () {
        var options={
            retain:false,
            qos:1
        };
        var respon = this.response;
        var emit = this.emit;
        var client  = mqtt.connect("mqtt://iot.eclipse.org",{clientId:"mqttjs0109843"});
        client.on("connect",function(){                        
            const factArr = data;
            const factIndex = Math.floor(Math.random() * factArr.length);
            const randomFact = factArr[factIndex];
            const speechOutput = GET_FACT_MESSAGE + randomFact.description + ' in '+ DEFAULT_SCREEN;
            client.publish('dashboard',randomFact.name,options);
            respon.cardRenderer(SKILL_NAME, GET_FACT_MESSAGE + randomFact.description + ' in ' + DEFAULT_SCREEN);            
            respon.speak(speechOutput);
            emit(':responseReady');
            client.end();
        });       
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
