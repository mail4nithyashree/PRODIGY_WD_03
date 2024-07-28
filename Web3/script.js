document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("status");
    const restartButton = document.getElementById("restartButton");
    const modeSelect = document.getElementById("modeSelect");
    const aiLevel = document.getElementById("aiLevel");
    const xScoreText = document.getElementById("xScore");
    const oScoreText = document.getElementById("oScore");
    const playerToggle = document.getElementById("switch");
    const winnerPopup = document.getElementById("winnerPopup");
    const popupMessage = document.getElementById("popupMessage");

    let board = Array(9).fill(null);
    let currentPlayer = "X";
    let scores = { X: 0, O: 0 };
    let gameActive = true;
    let playWithAI = false;
    let aiDifficulty = "easy";
    let playerSymbol = "X";
    let aiSymbol = "O";

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (board[index] || !gameActive) return;

        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWinner(currentPlayer)) {
            updateStatus(`${currentPlayer} wins!`);
            scores[currentPlayer]++;
            updateScores();
            celebrateResult();
            gameActive = false;
        } else if (board.every(cell => cell)) {
            updateStatus("It's a draw!");
            celebrateResult();
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateStatus(`${currentPlayer}'s turn`);
            if (playWithAI && currentPlayer === aiSymbol) {
                setTimeout(aiMove, 500);
            }
        }
    }

    function checkWinner(player) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        return winningCombinations.some(combination =>
            combination.every(index => board[index] === player)
        );
    }

    function updateStatus(message) {
        statusText.textContent = message;
    }

    function updateScores() {
        xScoreText.textContent = scores.X;
        oScoreText.textContent = scores.O;
    }

    function resetGame() {
        board.fill(null);
        cells.forEach(cell => (cell.textContent = ""));
        gameActive = true;
        currentPlayer = "X";
        playerSymbol = playerToggle.checked ? "O" : "X";
        aiSymbol = playerSymbol === "X" ? "O" : "X";
        updateStatus(`${currentPlayer}'s turn`);

        if (playWithAI && playerSymbol === "O") {
            aiMove();
            currentPlayer = playerSymbol;
            updateStatus(`${currentPlayer}'s turn`);
        }
    }

    function aiMove() {
        let index;
        if (aiDifficulty === "easy") {
            do {
                index = Math.floor(Math.random() * 9);
            } while (board[index]);
        } else if (aiDifficulty === "medium") {
            index = findBestMove('medium');
        } else if (aiDifficulty === "hard") {
            index = findBestMove('hard');
        }
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;

        if (checkWinner(currentPlayer)) {
            updateStatus(`${currentPlayer} wins!`);
            scores[currentPlayer]++;
            updateScores();
            celebrateResult();
            gameActive = false;
        } else if (board.every(cell => cell)) {
            updateStatus("It's a draw!");
            celebrateResult();
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateStatus(`${currentPlayer}'s turn`);
        }
    }

    function findBestMove(difficulty) {
        if (difficulty === 'medium') {
            let winningMove = findWinningMove(currentPlayer);
            if (winningMove !== null) return winningMove;

            let opponent = currentPlayer === 'X' ? 'O' : 'X';
            let blockingMove = findWinningMove(opponent);
            if (blockingMove !== null) return blockingMove;

            let emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        } else if (difficulty === 'hard') {
            return minimax(board, currentPlayer).index;
        }
    }

    function findWinningMove(player) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === player && board[b] === player && board[c] === null) return c;
            if (board[a] === player && board[b] === null && board[c] === player) return b;
            if (board[a] === null && board[b] === player && board[c] === player) return a;
        }
        return null;
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

        if (checkWinner('X')) {
            return { score: -10 };
        } else if (checkWinner('O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function celebrateResult() {
        const resultMessage = statusText.textContent;
        popupMessage.textContent = resultMessage;
        winnerPopup.show();
        setTimeout(() => winnerPopup.hide(), 3000);
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    restartButton.addEventListener("click", resetGame);
    modeSelect.addEventListener("change", () => {
        playWithAI = modeSelect.value === "ai";
        aiLevel.style.display = playWithAI ? "block" : "none";
        resetGame();
    });
    document.querySelectorAll('input[name="level"]').forEach(radio => {
        radio.addEventListener("change", () => aiDifficulty = radio.value);
    });

    resetGame();
});