document.addEventListener("DOMContentLoaded", function () {
    const tutorialPopup = document.createElement("div");
    tutorialPopup.classList.add("tutorial-popup-box");
    tutorialPopup.innerHTML = `
        <div class="tutorial-content">
            <span class="close-btn">&times;</span>
            <h2>Tutorial: Erobere den Kalten Krieg!</h2>
            <div class="gamerules">
            <p>Willkommen bei <strong>Dawn of Empires</strong>! Dein Ziel ist es, gegnerische Basen zu zerstören und deine eigene strategisch zu verteidigen.</p>
            </div>
            <h3>Einheitenarten 💣</h3>
            <div class="gamerules">
                <p><span>Verteidigungseinheiten:</span> Abwehrgeschütze, Anti-Panzer-Kanonen, Abfangjäger</p>
                <p><span>Angriffseinheiten:</span> Strategische Bomber, Kampfpanzer, Raketenartillerie</p>
            </div>

            <h3>Wirtschaft & Strategie 💰</h3>
            <div class="gamerules"><p>Jede Runde bekommst du begrenzte Ressourcen. Setze sie weise ein, um deine Einheiten zu kaufen und zu platzieren.</p></div>

            <h3>Spielablauf ⚔️</h3>
            <div class="gamerules">
                <p><span>Wähle deine Nation:</span> Deutschland, USA oder UdSSR</p>
                <p><span>Positioniere deine Truppen</span> und plane deinen Angriff</p>
                <p><span>Verteidige deine Basis</span> und nutze Kontermechaniken</p>
                <p><span>Zerstöre die 3 gegnerischen Basen</span>, um zu siegen!</p>
            </div>

            <div class="gamerules"><p><strong>Denke strategisch, handle weise – und führe dein Imperium zum Sieg!</strong></p></div>
        </div>
    `;
    document.body.appendChild(tutorialPopup);
    

    tutorialPopup.style.display = "none";

    const tutorialButton = document.querySelector(".tutorial-box"); 
    const closeButton = tutorialPopup.querySelector(".close-btn");

    tutorialButton.addEventListener("click", function () {
        tutorialPopup.style.display = "flex";
    });

    closeButton.addEventListener("click", function () {
        tutorialPopup.style.display = "none";
    });

    tutorialPopup.addEventListener("click", function (event) {
        if (event.target === tutorialPopup) {
            tutorialPopup.style.display = "none";
        }
    });
});
