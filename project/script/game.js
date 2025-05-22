// ==== GAME DATA ====
const ROWS = 7, COLS = 7;
const PLAYER = 0, BOT = 1;
const BASES = [
    {row:0, col:0, side:PLAYER}, {row:0, col:3, side:PLAYER}, {row:0, col:6, side:PLAYER},
    {row:6, col:0, side:BOT},    {row:6, col:3, side:BOT},    {row:6, col:6, side:BOT}
];
const UNIT_TYPES = {
    attack:  {cost:20, emoji:"⚔️",   name:"Panzer"},
    defense: {cost:20, emoji:"🛡️",   name:"Verteidigung"},
    antiAir: {cost:10, emoji:"🧿",   name:"Luftabwehr", life: 2},
    rocket:  {cost:50, emoji:"🚀",   name:"Rakete"},
    flieger: {cost:30, emoji:"✈️",   name:"Fliegerangriff"}
};
const BASE_EMOJI = "🏯";
const START_MONEY = 30, MONEY_PER_ROUND = 10;

// ==== GAME STATE ====
let board, units, bases;
let money = [START_MONEY, START_MONEY*2]; // BOT doppelt so viel Startgeld
let round = 1;
let currentPlayer = PLAYER;
let selectedType = null;
let selectedCell = null;
let rocketReady = false;
let fliegerReady = false;
let gameOver = false;

// ==== INIT ====
function initGame() {
    // Remove overlay if present
    const overlay = document.getElementById("gameover-overlay");
    if (overlay) overlay.remove();

    bases = BASES.map(b => ({
        ...b, alive:true
    }));
    board = Array.from({length:ROWS},()=>Array.from({length:COLS},()=>({unit:null, base:null})));
    bases.forEach(base=>{
        board[base.row][base.col].base = base;
    });
    units = [];
    money = [START_MONEY, START_MONEY*2];
    round = 1;
    currentPlayer = PLAYER;
    selectedType = null;
    selectedCell = null;
    rocketReady = false;
    fliegerReady = false;
    gameOver = false;
    render();
    setMessage("Du bist dran! Platziere oder ziehe eine Einheit.");
}
window.onload = initGame;

// ==== RENDER ====
function render() {
    const gb = document.getElementById("game-board");
    gb.innerHTML = "";
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        if ([0,1,5,6].includes(r)) cell.classList.add("dark-cell");
        cell.dataset.row = r;
        cell.dataset.col = c;

        // Highlight eigene und gegnerische Einheiten
        if(board[r][c].unit) {
            if(board[r][c].unit.owner === PLAYER) cell.classList.add("own-unit");
            if(board[r][c].unit.owner === BOT) cell.classList.add("enemy-unit");
        }

        if(selectedCell && selectedCell.row === r && selectedCell.col === c)
            cell.classList.add("selected");

        // Base
        const base = board[r][c].base;
        if(base && base.alive) {
            cell.innerHTML += `<span class="base-emoji">${BASE_EMOJI}</span>`;
        }
        // Anti-Air (Luftabwehr)
        if(board[r][c].unit && board[r][c].unit.type === "antiAir") {
            let cls = board[r][c].unit.owner === PLAYER ? "unit-player" : "unit-bot";
            cell.innerHTML += `<span class="unit-emoji ${cls}">${UNIT_TYPES.antiAir.emoji}</span><span style="font-size:0.8rem;position:absolute;bottom:2px;right:6px">${board[r][c].unit.life}</span>`;
        }
        // Unit
        else if(board[r][c].unit) {
            let u = board[r][c].unit;
            let cls = u.owner === PLAYER ? "unit-player" : "unit-bot";
            cell.innerHTML += `<span class="unit-emoji ${cls}">${UNIT_TYPES[u.type].emoji}</span>`;
        }
        gb.appendChild(cell);
    }
    document.getElementById("money-slot").textContent = `💰 ${money[PLAYER]}`;
    document.querySelectorAll('.slot').forEach(slot => slot.classList.remove("selected"));
    if(selectedType) {
        if(selectedType==="attack") document.getElementById("attack-slot").classList.add("selected");
        if(selectedType==="defense") document.getElementById("defense-slot").classList.add("selected");
        if(selectedType==="rocket") document.getElementById("rocket-slot").classList.add("selected");
        if(selectedType==="flieger") document.getElementById("flieger-slot").classList.add("selected");
        if(selectedType==="antiAir") document.getElementById("antiair-slot").classList.add("selected");
    }
    document.getElementById("info-slot").textContent = selectedType
        ? `Platzieren: ${UNIT_TYPES[selectedType].name}` : "";
    document.getElementById("end-turn-btn").disabled = currentPlayer !== PLAYER || gameOver;
}

// ==== SHOP ====
document.getElementById("attack-slot").onclick = () => selectShop("attack");
document.getElementById("defense-slot").onclick = () => selectShop("defense");
document.getElementById("rocket-slot").onclick = () => selectShop("rocket");
document.getElementById("flieger-slot").onclick = () => selectShop("flieger");
document.getElementById("antiair-slot").onclick = () => selectShop("antiAir");

function selectShop(type) {
    if(gameOver || currentPlayer !== PLAYER) return;
    selectedType = type;
    selectedCell = null;
    rocketReady = false;
    fliegerReady = false;
    if(type === "flieger") {
        setMessage("Wähle eine gegnerische Einheit als Ziel für den Fliegerangriff.");
        fliegerReady = true;
    } else {
        setMessage("Klicke auf ein erlaubtes Feld zum Platzieren.");
    }
    render();
}

// ==== BOARD CLICK ====
document.getElementById("game-board").onclick = function(e) {
    if(gameOver || currentPlayer !== PLAYER) return;
    const cell = e.target.closest(".cell");
    if(!cell) return;
    const row = +cell.dataset.row, col = +cell.dataset.col;

    // Fliegerangriff-Modus
    if(fliegerReady) {
        const targetUnit = board[row][col].unit;
        if(targetUnit 
            && targetUnit.owner === BOT 
            && (targetUnit.type === "attack" || targetUnit.type === "defense" || targetUnit.type === "antiAir")) {
            if(isAntiAirInArea(row, col)) {
                setMessage("Flieger wurde von Luftabwehr abgefangen!", "warning");
            } else {
                board[row][col].unit = null;
                setMessage("Fliegerangriff erfolgreich! Gegnerische Einheit zerstört.", "success");
            }
            money[PLAYER] -= UNIT_TYPES.flieger.cost;
            fliegerReady = false;
            selectedType = null;
            render();
            return;
        } else {
            setMessage("Wähle eine feindliche Einheit als Ziel (kein Flieger, keine Basis)!", "warning");
            return;
        }
    }

    // Rakete im Zielmodus
    if(rocketReady) {
        const targetBase = board[row][col].base;
        if(targetBase && targetBase.side === BOT && targetBase.alive) {
            if(isAntiAirInArea(row, col)) {
                setMessage("Rakete wurde von Luftabwehr abgefangen!", "warning");
            } else {
                targetBase.alive = false;
                setMessage("🚀 Rakete gestartet und feindliche Basis zerstört!", "success");
                checkGameOver();
            }
            money[PLAYER] -= UNIT_TYPES.rocket.cost;
            rocketReady = false;
            selectedType = null;
            render();
            return;
        } else {
            setMessage("Rakete kann nur auf eine feindliche Basis geschossen werden!", "warning");
            return;
        }
    }
    // Einheit platzieren
    if(selectedType) {
        if(!canPlaceUnit(row, col, PLAYER)) {
            setMessage("Nur in den ersten 2 Reihen deiner Seite platzierbar und nicht auf Basen!", "warning");
            return;
        }
        if(board[row][col].unit) {
            setMessage("Hier steht schon eine Einheit!", "warning");
            return;
        }
        if(selectedType === "rocket") {
            rocketReady = true;
            selectedCell = {row, col};
            setMessage("Wähle eine feindliche Basis als Ziel für die Rakete.");
            render();
            return;
        }
        if(money[PLAYER] < UNIT_TYPES[selectedType].cost) {
            setMessage("Nicht genug Geld!", "error");
            return;
        }
        let unit = {type: selectedType, owner: PLAYER, hasMoved: false};
        if(selectedType === "antiAir") unit.life = UNIT_TYPES.antiAir.life;
        board[row][col].unit = unit;
        units.push(unit);
        money[PLAYER] -= UNIT_TYPES[selectedType].cost;
        selectedType = null;
        render();
        setMessage("Einheit platziert.", "success");
        return;
    }
    // Einheit bewegen
    if(board[row][col].unit && board[row][col].unit.owner === PLAYER && board[row][col].unit.type !== "antiAir") {
        selectedCell = {row, col};
        setMessage("Wähle ein Ziel (leeres Feld, feindliche Einheit oder feindliche Basis).");
        render();
        return;
    }
    // Bewegung/Kampf/Basis-Angriff
    if(selectedCell) {
        const from = selectedCell, to = {row, col};
        const unit = board[from.row][from.col].unit;
        if(!unit) {selectedCell=null;return;}
        if(unit.type==="defense") {
            setMessage("Verteidigungseinheiten können sich nicht bewegen!", "warning");
            selectedCell = null;
            return;
        }
        if(unit.type === "antiAir") {
            setMessage("Luftabwehr kann nicht bewegt werden!", "warning");
            selectedCell = null;
            return;
        }
        if(unit.hasMoved) {
            setMessage("Diese Einheit hat bereits gezogen!", "warning");
            selectedCell = null;
            return;
        }
        if(!isAdjacent(from,to)) {
            setMessage("Nur auf angrenzende Felder bewegen!", "warning");
            selectedCell = null;
            return;
        }
        // PANZER zerstört Luftabwehr (Panzer bleibt stehen)
        if(board[to.row][to.col].unit && board[to.row][to.col].unit.type === "antiAir" && unit.type === "attack") {
            board[to.row][to.col].unit = unit;
            board[from.row][from.col].unit = null;
            unit.hasMoved = true;
            setMessage("Panzer hat Luftabwehr zerstört!", "success");
            selectedCell = null;
            render();
            return;
        }
        // Flieger/Angriff auf AntiAir (Flieger verliert, Panzer siehe oben)
        if(board[to.row][to.col].unit && board[to.row][to.col].unit.type === "antiAir" && unit.type !== "attack") {
            board[from.row][from.col].unit = null;
            setMessage("Deine Einheit wurde von Luftabwehr zerstört!", "error");
            selectedCell = null;
            render();
            return;
        }
        // Angriffseinheit auf Verteidigungseinheit: beide tot, 30 Geld
        if(unit.type === "attack" && board[to.row][to.col].unit && board[to.row][to.col].unit.type === "defense" && board[to.row][to.col].unit.owner !== PLAYER) {
            board[to.row][to.col].unit = null;
            board[from.row][from.col].unit = null;
            setMessage("Du hast eine Verteidigungseinheit zerstört! +30 Geld", "success");
            money[PLAYER] += 30;
            selectedCell = null;
            render();
            return;
        }
        // Standard-Kampf: beide tot
        if(board[to.row][to.col].unit && board[to.row][to.col].unit.owner !== PLAYER) {
            board[to.row][to.col].unit = null;
            board[from.row][from.col].unit = null;
            setMessage("Beide Einheiten zerstört!", "warning");
            selectedCell = null;
            render();
            return;
        }
        // Basis zerstören: Panzer berührt gegnerische Basis, Luftabwehr schützt NICHT
        if(board[to.row][to.col].base && board[to.row][to.col].base.side === BOT && board[to.row][to.col].base.alive) {
            if(unit.type === "attack" && !isAntiAirInArea(to.row, to.col)) {
                board[to.row][to.col].base.alive = false;
                board[to.row][to.col].unit = unit;
                board[from.row][from.col].unit = null;
                unit.hasMoved = true;
                setMessage("Panzer hat eine feindliche Basis zerstört!", "success");
                selectedCell = null;
                render();
                checkGameOver();
                return;
            }
            if(isAntiAirInArea(to.row, to.col)) {
                setMessage("Die Basis wird von Luftabwehr geschützt!", "warning");
                selectedCell = null;
                return;
            }
        }
        // Bewegung auf Feld, das von AntiAir geschützt wird (Rakete/Flieger wird zerstört; Panzer siehe oben)
        if(unit.type === "rocket" && isAntiAirInArea(to.row, to.col)) {
            board[from.row][from.col].unit = null;
            setMessage("Deine Einheit wurde von Luftabwehr abgefangen!", "error");
            selectedCell = null;
            render();
            return;
        }
        // Bewegung auf leeres Feld (ohne Base/Luftabwehr)
        if(!board[to.row][to.col].unit && (!board[to.row][to.col].base || !board[to.row][to.col].base.alive)) {
            board[to.row][to.col].unit = unit;
            board[from.row][from.col].unit = null;
            unit.hasMoved = true;
            setMessage("Einheit gezogen.", "success");
            selectedCell = null;
            render();
            return;
        }
        setMessage("Hier kannst du nicht hinziehen!", "warning");
        selectedCell = null;
        return;
    }
};

// ==== EINHEITEN PLATZIEREN NUR IN EIGENEN REIHEN & NICHT AUF BASEN ====
function canPlaceUnit(row, col, side) {
    if(board[row][col].unit) return false;
    if(board[row][col].base && board[row][col].base.alive) return false;
    if(side === PLAYER) return row === 0 || row === 1;
    if(side === BOT)    return row === 5 || row === 6;
    return false;
}
function isAdjacent(a, b) {
    const dr = Math.abs(a.row-b.row), dc = Math.abs(a.col-b.col);
    return (dr+dc === 1);
}
function isAntiAirInArea(row, col) {
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) {
        let nr=row+dr, nc=col+dc;
        if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) {
            let u = board[nr][nc].unit;
            if(u && u.type==="antiAir" && u.life > 0) return true;
        }
    }
    return false;
}

// ==== RUNDE UND BOT ====
document.getElementById("end-turn-btn").onclick = function() {
    if(gameOver || currentPlayer !== PLAYER) return;
    // Luftabwehr Lebensdauer verringern
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
        let u = board[r][c].unit;
        if(u && u.type === "antiAir" && u.owner === PLAYER) {
            u.life--;
            if(u.life <= 0) board[r][c].unit = null;
        }
        if(board[r][c].unit && board[r][c].unit.owner === PLAYER)
            board[r][c].unit.hasMoved = false;
    }
    currentPlayer = BOT;
    money[PLAYER] += MONEY_PER_ROUND;
    money[BOT] += MONEY_PER_ROUND*2; // BOT doppelt so viel Geld pro Runde
    round++;
    render();
    setMessage("Bot ist am Zug...");
    setTimeout(botTurn, 800);
};

// ==== BOT LOGIK ====
let botUnitCycle = ["rocket", "flieger", "attack", "defense", "antiAir"];
let botUnitIndex = 0;

function botTurn() {
    if(gameOver) return;
    // Luftabwehr Lebensdauer verringern
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
        let u = board[r][c].unit;
        if(u && u.type === "antiAir" && u.owner === BOT) {
            u.life--;
            if(u.life <= 0) board[r][c].unit = null;
        }
    }

    // 1. Rakete, falls genug Geld, Ziel = Spieler-Basen ohne Luftabwehr
    if(money[BOT] >= UNIT_TYPES.rocket.cost) {
        let targets = bases.filter(b=>b.side===PLAYER && b.alive && !isAntiAirInArea(b.row, b.col));
        if(targets.length > 0) {
            let t = targets[Math.floor(Math.random()*targets.length)];
            t.alive = false;
            money[BOT] -= UNIT_TYPES.rocket.cost;
            setMessage("Bot hat eine Rakete auf deine Basis geschossen! 🚀", "error");
            render();
            checkGameOver();
            endBotTurn();
            return;
        }
    }

    // 2. Fliegerangriff, falls genug Geld, Ziel = wichtige Spielereinheit ohne Luftabwehr drumherum
    if(money[BOT] >= UNIT_TYPES.flieger.cost) {
        let targets = [];
        for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
            let u = board[r][c].unit;
            if(u && u.owner === PLAYER && (u.type==="attack"||u.type==="defense"||u.type==="antiAir") && !isAntiAirInArea(r,c)) {
                targets.push({row:r,col:c});
            }
        }
        if(targets.length>0) {
            let t = targets[Math.floor(Math.random()*targets.length)];
            board[t.row][t.col].unit = null;
            money[BOT] -= UNIT_TYPES.flieger.cost;
            setMessage("Bot hat einen Fliegerangriff auf deine Einheit geflogen! ✈️", "error");
            render();
            endBotTurn();
            return;
        }
    }

    // 3. Luftabwehr bauen, falls Spieler viele Flieger oder Raketen einsetzt
    if(money[BOT] >= UNIT_TYPES.antiAir.cost) {
        // Baue Luftabwehr, wenn Spieler Flieger/Rakete kürzlich benutzt hat oder viele Panzer in Reichweite sind
        let spawnRows = [5,6];
        let free = [];
        for(let r of spawnRows)
            for(let c=0;c<COLS;c++)
                if(!board[r][c].unit && (!board[r][c].base || !board[r][c].base.alive))
                    free.push({row:r,col:c});
        if(free.length>0) {
            let pos = free[Math.floor(Math.random()*free.length)];
            board[pos.row][pos.col].unit = {type:"antiAir", owner:BOT, hasMoved:false, life:UNIT_TYPES.antiAir.life};
            money[BOT] -= UNIT_TYPES.antiAir.cost;
            setMessage("Bot hat eine Luftabwehr platziert! 🧿");
            render();
        }
    }

    // 4. Einheitenkauf abwechselnd: Panzer/Verteidigung/Flieger/Rakete/Luftabwehr
    let type = botUnitCycle[botUnitIndex];
    botUnitIndex = (botUnitIndex+1)%botUnitCycle.length;
    if(money[BOT] >= UNIT_TYPES[type].cost) {
        let spawnRows = [5,6];
        let free = [];
        for(let r of spawnRows)
            for(let c=0;c<COLS;c++)
                if(!board[r][c].unit && (!board[r][c].base || !board[r][c].base.alive))
                    free.push({row:r,col:c});
        if(free.length>0) {
            let pos = free[Math.floor(Math.random()*free.length)];
            let unit = {type:type, owner:BOT, hasMoved:false};
            if(type==="antiAir") unit.life = UNIT_TYPES.antiAir.life;
            board[pos.row][pos.col].unit = unit;
            units.push(unit);
            money[BOT] -= UNIT_TYPES[type].cost;
            setMessage(`Bot hat eine Einheit (${UNIT_TYPES[type].emoji}) platziert!`);
            render();
        }
    }

    // 5. Bewegung Panzer
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
        let u = board[r][c].unit;
        if(u && u.owner===BOT && u.type==="attack" && !u.hasMoved) {
            let dirs = [
                {dr:-1, dc:0}, {dr:1, dc:0}, {dr:0, dc:-1}, {dr:0, dc:1}
            ];
            dirs = dirs.sort(()=>Math.random()-0.5);
            for(let d of dirs) {
                let nr = r+d.dr, nc = c+d.dc;
                if(nr<0||nr>=ROWS||nc<0||nc>=COLS) continue;
                let target = board[nr][nc].unit;
                if(target && target.type==="antiAir" && target.owner===PLAYER) {
                    board[nr][nc].unit = u;
                    board[r][c].unit = null;
                    u.hasMoved = true;
                    setMessage("Bot hat deine Luftabwehr zerstört!", "error");
                    render();
                    break;
                }
                if(target && target.owner===PLAYER && target.type==="defense") {
                    board[nr][nc].unit = null;
                    board[r][c].unit = null;
                    money[BOT] += 30;
                    setMessage("Bot hat deine Verteidigungseinheit zerstört!", "error");
                    render();
                    break;
                }
                if(target && target.owner===PLAYER) {
                    board[nr][nc].unit = null;
                    board[r][c].unit = null;
                    setMessage("Bot hat deine Einheit im Kampf zerstört!", "error");
                    render();
                    break;
                }
                if(board[nr][nc].base && board[nr][nc].base.side === PLAYER && board[nr][nc].base.alive && !isAntiAirInArea(nr, nc)) {
                    board[nr][nc].base.alive = false;
                    board[nr][nc].unit = u;
                    board[r][c].unit = null;
                    u.hasMoved = true;
                    setMessage("Bot hat deine Basis zerstört!", "error");
                    render();
                    checkGameOver();
                    break;
                }
                if(!target && (!board[nr][nc].base || !board[nr][nc].base.alive)) {
                    board[nr][nc].unit = u;
                    board[r][c].unit = null;
                    u.hasMoved = true;
                    setMessage("Bot hat eine Einheit bewegt.");
                    render();
                    break;
                }
            }
        }
    }
    endBotTurn();
}

function endBotTurn() {
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
        if(board[r][c].unit && board[r][c].unit.owner === BOT)
            board[r][c].unit.hasMoved = false;
    }
    currentPlayer = PLAYER;
    render();
    setMessage("Du bist wieder dran!");
}

// ==== SIEG ODER NIEDERLAGE ====
function checkGameOver() {
    let playerBases = bases.filter(b=>b.side===PLAYER && b.alive).length;
    let botBases = bases.filter(b=>b.side===BOT && b.alive).length;
    if(playerBases === 0) {
        showGameOverOverlay(false);
        gameOver = true;
    }
    if(botBases === 0) {
        showGameOverOverlay(true);
        gameOver = true;
    }
}

// ==== MESSAGE-BOX (ANIMIERT & STYLES) ====
function setMessage(msg, type) {
    const messageBox = document.getElementById("message");
    messageBox.textContent = msg;
    messageBox.classList.remove("success", "warning", "error");
    if (type) messageBox.classList.add(type);
    // Animation neu triggern
    messageBox.style.animation = "none";
    void messageBox.offsetWidth;
    messageBox.style.animation = null;
}

// ==== GAME OVER OVERLAY ====
function showGameOverOverlay(won) {
    // Remove overlay if already present
    const old = document.getElementById("gameover-overlay");
    if (old) old.remove();

    const overlay = document.createElement("div");
    overlay.id = "gameover-overlay";
    overlay.className = "gameover-overlay";
    overlay.innerHTML = `
        <div class="gameover-modal">
            <h2>${won ? "🎉 Gratulation, du hast gewonnen!" : "😢 Leider verloren"}</h2>
            <p>${won ? "Du hast alle gegnerischen Basen zerstört. Großartig gemacht!" : "Der Bot hat all deine Basen zerstört. Versuch es nochmal!"}</p>
            <button id="back-to-start-btn">Zurück zur Startseite</button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("back-to-start-btn").onclick = function() {
        window.location.href = "../../../index.html";
    };
}