// Start screen handler
document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    initializeGame();
});

function initializeGame() {
    gameArea = document.getElementById('gameArea');
    player = document.getElementById('player');
    score = 0;
    lives = 5;
    gameOver = false;

    document.getElementById("score").textContent="Current Score: " + score;

    document.getElementById("score").style.color="red";
    document.getElementById("score").style.fontSize="28px";
    document.getElementById("score").style.position="absolute";
    document.getElementById("score").style.left="20px";
    document.getElementById("score").style.top="100px";
    document.getElementById("score").style.fontWeight="bold";
    document.getElementById("score").style.zIndex="50";

    // Create lives display with snowflake emojis
    const livesDisplay = document.createElement('div');
    livesDisplay.id = 'lives';
    livesDisplay.innerHTML = 'Lives: <span class="snowflake-emoji">' + "❆".repeat(lives) + '</span>';
    livesDisplay.style.color = "red";
    livesDisplay.style.fontSize = "28px";
    livesDisplay.style.position = "absolute";
    livesDisplay.style.right = "20px";
    livesDisplay.style.top = "100px";
    livesDisplay.style.letterSpacing = "6px";
    livesDisplay.style.fontWeight = "bold";
    livesDisplay.style.zIndex = "50";
    document.body.appendChild(livesDisplay);

    document.body.addEventListener("keydown", (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            keysPressed[e.key] = true;
        }
    });

    document.body.addEventListener("keyup", (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            keysPressed[e.key] = false;
        }
    });

    // Continuous smooth movement using requestAnimationFrame
    function updatePlayerPosition() {
        const playerRightLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
        const moveSpeed = 8;
        
        if (keysPressed['ArrowLeft'] && playerRightLeft > 45) {
            player.style.left = playerRightLeft - moveSpeed + 'px';
        }
        if (keysPressed['ArrowRight'] && playerRightLeft < window.innerWidth - 475) {
            player.style.left = playerRightLeft + moveSpeed + 'px';
        }
        
        requestAnimationFrame(updatePlayerPosition);
    }

    updatePlayerPosition();

    // Start the game spawning
    startSpawning();
}

// Game variables (declared outside so they can be reset)
let gameArea;
let player;
let score = 0;
let lives = 5;
let gameOver = false;
let spawnInterval;
const keysPressed = {};


// Function to create a snowflake
function createSnowflake() {
	if (gameOver) return;
	
 	const snowflake = document.createElement('div');
  	snowflake.classList.add('snowflake');
  	snowflake.textContent = '❆';
  	snowflake.style.fontSize = '28px';
  	snowflake.style.display = 'flex';
  	snowflake.style.alignItems = 'center';
  	snowflake.style.justifyContent = 'center';
  	snowflake.style.left = Math.random() * (window.innerWidth - 528) + 49 + 'px';
  	snowflake.style.top = '0px';
  	gameArea.appendChild(snowflake);

	// Difficulty scaling: faster fall speed as score increases
	const fallSpeed = 5 + (score * 0.2);
	
  	let fallInterval = setInterval(() => {
		if (gameOver) {
			clearInterval(fallInterval);
			return;
		}
		
    		const snowflakeTop = parseInt(window.getComputedStyle(snowflake).getPropertyValue('top'));
    		const snowflakeLeft = parseInt(window.getComputedStyle(snowflake).getPropertyValue('left'));
    		const playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));

    		// Check for collision first (before marking as missed)
    		if (snowflakeTop >= window.innerHeight - 150 && snowflakeLeft >= playerLeft - 50 && snowflakeLeft <= playerLeft + 50) {
			updateScore(score+1);
      			clearInterval(fallInterval);
      			gameArea.removeChild(snowflake);
			return;
    		}

    		// Snowflake falling
    		if (snowflakeTop < window.innerHeight - 150) {
			snowflake.style.top = snowflakeTop + fallSpeed + 'px';
    		} else {
    			loseLife();
      			clearInterval(fallInterval);
      			gameArea.removeChild(snowflake);
    		}
	}, 50);
}

function updateScore(newScore) {
	score = newScore;
	document.getElementById("score").textContent="Current Score: " + score;
}

function loseLife() {
	lives--;
	const livesElement = document.getElementById("lives");
	livesElement.innerHTML = 'Lives: <span class="snowflake-emoji">' + "❆".repeat(lives) + '</span>';
	
	if (lives <= 0) {
		endGame();
	}
}

function endGame() {
	gameOver = true;
	clearInterval(spawnInterval);
	
	// Show game over screen
	const gameOverScreen = document.createElement('div');
	gameOverScreen.id = 'gameOverScreen';
	gameOverScreen.style.position = 'absolute';
	gameOverScreen.style.top = '0';
	gameOverScreen.style.left = '0';
	gameOverScreen.style.width = '100%';
	gameOverScreen.style.height = '100%';
	gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
	gameOverScreen.style.display = 'flex';
	gameOverScreen.style.flexDirection = 'column';
	gameOverScreen.style.justifyContent = 'center';
	gameOverScreen.style.alignItems = 'center';
	gameOverScreen.style.zIndex = '100';
	
	const gameOverText = document.createElement('h1');
	gameOverText.textContent = 'GAME OVER!';
	gameOverText.style.color = 'white';
	gameOverText.style.fontSize = '60px';
	gameOverText.style.margin = '0';
	
	const finalScore = document.createElement('p');
	finalScore.textContent = 'Final Score: ' + score;
	finalScore.style.color = 'white';
	finalScore.style.fontSize = '40px';
	finalScore.style.margin = '20px 0';
	
	const restartBtn = document.createElement('button');
	restartBtn.textContent = 'Restart Game';
	restartBtn.style.fontSize = '24px';
	restartBtn.style.padding = '15px 30px';
	restartBtn.style.marginTop = '20px';
	restartBtn.style.cursor = 'pointer';
	restartBtn.onclick = () => location.reload();
	
	gameOverScreen.appendChild(gameOverText);
	gameOverScreen.appendChild(finalScore);
	gameOverScreen.appendChild(restartBtn);
	document.body.appendChild(gameOverScreen);
}

// Dynamic snowflake spawning that gets faster as score increases
function startSpawning() {
	createSnowflake();
	
	// Spawn rate decreases (more frequent spawning) as score increases
	// Starts at 2000ms, goes down to 500ms minimum
	const spawnDelay = Math.max(500, 2000 - (score * 50));
	
	if (!gameOver) {
		spawnInterval = setTimeout(startSpawning, spawnDelay);
	}
}

// Start the game
startSpawning();