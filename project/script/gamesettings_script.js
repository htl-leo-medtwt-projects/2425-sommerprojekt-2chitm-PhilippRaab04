// Global Variables
let country = null; // To store the selected country
let username = "";  // To store the username
let difficulty = ""; // To store the selected difficulty
let country1 = null; // To store the selected country for Player 1
let country2 = null; // To store the selected country for Player 2
let username1 = "";  // To store the username for Player 1
let username2 = "";  // To store the username for Player 2

// Selecting Elements
const flags = document.querySelectorAll('.flag');
const againstBotButton = document.getElementById('against-bot');
const coopButton = document.getElementById('coop');
const botModeContainer = document.getElementById('bot-mode-container');
const coopModeContainer = document.getElementById('coop-mode-container');
const backButtonBot = document.getElementById('back-button-bot');
const backButtonCoop = document.getElementById('back-button-coop');
const backToIndexButton = document.getElementById('back-to-index');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const usernameInput = document.getElementById('username');
const usernameInput1 = document.getElementById('username1');
const usernameInput2 = document.getElementById('username2');
const battleButton = document.getElementById('battle-button');
const battleButtonCoop = document.getElementById('battle-button-coop');

// Function to handle flag selection
function setupFlagSelection() {
    flags.forEach(flag => {
        flag.addEventListener('click', () => {
            const selectedCountry = flag.getAttribute('data-country');
            if (!country1) {
                country1 = selectedCountry;
                console.log(`Player 1 Selected Country: ${country1}`);
            } else if (!country2) {
                country2 = selectedCountry;
                console.log(`Player 2 Selected Country: ${country2}`);
            } else {
                country = selectedCountry; // For Against Bot mode
                console.log(`Selected Country: ${country}`);
            }
        });
    });
}

// Function to handle difficulty selection
function setupDifficultySelection() {
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficulty = button.getAttribute('data-difficulty');
            console.log(`Selected Difficulty: ${difficulty}`);
        });
    });
}

// Function to handle battle button click for Against Bot mode
function setupBattleButton() {
    battleButton.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username === "") {
            alert("Please enter a username!");
            return;
        }
        console.log(`Username: ${username}`);
        console.log(`Difficulty: ${difficulty}`);
        console.log("Starting Battle!");
    });
}

// Function to handle battle button click for COOP mode
function setupBattleButtonCoop() {
    battleButtonCoop.addEventListener('click', () => {
        username1 = usernameInput1.value.trim();
        username2 = usernameInput2.value.trim();

        if (username1 === "" || username2 === "") {
            alert("Please enter usernames for both players!");
            return;
        }

        if (!country1 || !country2) {
            alert("Please select a country for both players!");
            return;
        }

        console.log(`Username 1: ${username1}`);
        console.log(`Username 2: ${username2}`);
        console.log(`Country 1: ${country1}`);
        console.log(`Country 2: ${country2}`);
        console.log("Starting Battle!");
    });
}

// Function to handle Against Bot mode
function setupAgainstBotMode() {
    againstBotButton.addEventListener('click', () => {
        // Hide elements of the main menu
        document.querySelector('.flags-container').style.display = 'none';
        document.querySelector('.game-options').style.display = 'none';
        backToIndexButton.style.display = 'none'; // Hide the "Back to Index" button

        // Show the Against Bot mode container
        botModeContainer.style.display = 'block';

        // Add event listener for the "Back" button in Against Bot mode
        backButtonBot.addEventListener('click', () => {
            botModeContainer.style.display = 'none';
            document.querySelector('.flags-container').style.display = 'block';
            document.querySelector('.game-options').style.display = 'block';
            backToIndexButton.style.display = 'block'; // Show the "Back to Index" button
        });
    });
}

// Function to handle COOP mode
function setupCoopMode() {
    coopButton.addEventListener('click', () => {
        // Hide elements of the main menu
        document.querySelector('.flags-container').style.display = 'none';
        document.querySelector('.game-options').style.display = 'none';
        backToIndexButton.style.display = 'none'; // Hide the "Back to Index" button

        // Show the COOP mode container
        coopModeContainer.style.display = 'block';

        // Add event listener for the "Back" button in COOP mode
        backButtonCoop.addEventListener('click', () => {
            coopModeContainer.style.display = 'none';
            document.querySelector('.flags-container').style.display = 'block';
            document.querySelector('.game-options').style.display = 'block';
            backToIndexButton.style.display = 'block'; // Show the "Back to Index" button
        });
    });
}

// Function to handle navigation back to index.html
function setupBackToIndex() {
    backToIndexButton.addEventListener('click', () => {
        window.location.href = '../../index.html'; // Navigate to index.html
    });
}

// Initialize all event listeners
function initializeGame() {
    setupFlagSelection();
    setupDifficultySelection();
    setupBattleButton();
    setupBattleButtonCoop();
    setupAgainstBotMode();
    setupCoopMode();
    setupBackToIndex(); // Add the new Back Button logic
}

// Start the game setup
initializeGame();