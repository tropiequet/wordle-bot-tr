require('dotenv').config();
const { Client, Intents, DMChannel } = require('discord.js');


const client = new Client({
    partials: ["CHANNEL"],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});

client.on('ready', () => {
    console.log('bot is ready')
});


var word;
var guess;
var isStarted = false;
var guessCount;
var alphabet;
var guessDisplay;

const letters = {
    'a': ':regional_indicator_a:',
    'b': ':regional_indicator_b:',
    'c': ':regional_indicator_c:',
    'd': ':regional_indicator_d:',
    'e': ':regional_indicator_e:',
    'f': ':regional_indicator_f:',
    'g': ':regional_indicator_g:',
    'h': ':regional_indicator_h:',
    'i': ':regional_indicator_i:',
    'j': ':regional_indicator_j:',
    'k': ':regional_indicator_k:',
    'l': ':regional_indicator_l:',
    'm': ':regional_indicator_m:',
    'n': ':regional_indicator_n:',
    'o': ':regional_indicator_o:',
    'p': ':regional_indicator_p:',
    'q': ':regional_indicator_q:',
    'r': ':regional_indicator_r:',
    's': ':regional_indicator_s:',
    't': ':regional_indicator_t:',
    'u': ':regional_indicator_u:',
    'v': ':regional_indicator_v:',
    'w': ':regional_indicator_w:',
    'x': ':regional_indicator_x:',
    'y': ':regional_indicator_y:',
    'z': ':regional_indicator_z:'
};




client.on('messageCreate', (message) =>{
   // if (message.channel.type == 'DM'){ // use this if you only want it to work in DM
        
    
        let msg = message.content.split(' ')
        let command = msg[0]

    

        if (command === '!ping'){
            message.reply({
                content: 'pong'
            })
        }else if (command === '!start'){
            if (isStarted){
                message.reply({
                    content: 'Game already in progress! Use !guess to guess a word!'
                })
            }else{
                message.reply({
                    content: 'WordleBot is starting! Use !guess to guess a word!'
                })
                word = getWord().toString();
                console.log(word)
                guessCount = 0; 
                isStarted = true;
                alphabet = Array.from('abcdefghijklmnopqrstuvwxyz');
            }
        
        }else if (command === '!guess'){
            if (isStarted){
                guessCount++;
                guess = msg[1];
                guessDisplay = "";

                for (let i = 0; i < guess.length; i++) {
                    guessDisplay += letters[guess[i]];
                }
                console.log(guessDisplay);
                if (typeof guess === 'undefined' || guess.length != 5){
                    message.reply("Please make sure your guess is 5 characters long!");
                    guessCount--;
                }else if (guess.trim() === word.trim()){
                    result = checkGuess();
                    result += "\n" + guessDisplay + "\nWOOHOO! YOU GUESSED IT! Type !start to play again";
                    message.reply(result.toString());
                    isStarted = false;
                }else if (guessCount < 6){
                    result = checkGuess();
                    result += "\n" + guessDisplay + "\n" + alphabet.join(" ");
                    message.reply(result.toString());


                }else if (guessCount === 6){
                    result = checkGuess();
                    result += "\n" + guessDisplay + "\nOut of guesses! The word was: " + word;
                    message.reply(result.toString());
                    isStarted = false;
                }
            }else{
                message.reply("Please start a game first using !start");
            }
            
        }
   // } //DM BRACKET
});

client.login(process.env.TOKEN);



function getWord(){
    let fs = require("fs");
    let line = fs.readFileSync("./words.txt").toString('utf-8');
    let wordList = line.split("\n");

    let ranNum = Math.floor(Math.random() * wordList.length) + 1; 
    let word = wordList[ranNum].toString();

    return word;
}


function checkGuess(){
    let result = "";
    let index;
    let char;
    let newChar;
    for (let i = 0; i < word.length - 1; i++) {
        if (word.includes(guess[i])){ // letter is in word but not necessarily in right spot
            if (word[i] === guess[i]){ //right spot
                result += ':green_square:';
                char = guess[i];
                index = alphabet.indexOf(char);
                newChar = "**" + char + "**"
                alphabet[index] = newChar;
            }else{ //wrong spot
                result +=':yellow_square:';
                char = guess[i];
                index = alphabet.indexOf(char);
                newChar = "**" + char + "**"
                alphabet[index] = newChar;
            }
        }else{//not in word
            result += ':black_large_square:';
            char = guess[i];
            index = alphabet.indexOf(char);
            newChar = "~~" + char + "~~"
            alphabet[index] = newChar;
        }
      }
      return result;
}








