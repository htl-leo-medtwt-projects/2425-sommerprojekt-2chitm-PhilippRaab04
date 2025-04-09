// Selektieren der Elemente
const flags = document.querySelectorAll('.flag');
const againstBotButton = document.getElementById('against-bot');
const coopButton = document.getElementById('coop');

// Eventlistener für die Flaggen
flags.forEach(flag => {
    flag.addEventListener('click', () => {
        alert(`You selected the flag of ${flag.alt}`);
    });
});

// Eventlistener für die Spielmodus-Optionen
againstBotButton.addEventListener('click', () => {
    alert('You chose to play Against Bot!');
});

coopButton.addEventListener('click', () => {
    alert('You chose COOP mode!');
});