import {
	createBoard,
	markTile,
	revealTile,
	checkWon,
	checkLost,
	TILE_STATUSES,
} from "./minesweeper.js";

const BOARD_SIZE = 9,
	NO_OF_MINES = 9;

const gameMessage = document.querySelector(".subtext");

const gameBoard = createBoard(BOARD_SIZE, NO_OF_MINES);

gameBoard.forEach(row => {
	row.forEach(tile => {
		board.append(tile.element);

		// Left Click on Tile
		tile.element.addEventListener("click", () => {
			revealTile(gameBoard, tile);
			checkGameEnd();
		});

		// Right Click on Tile
		tile.element.addEventListener("contextmenu", e => {
			e.preventDefault();
			markTile(tile);
		});
	});
});
board.style.setProperty("--size", BOARD_SIZE);
mine_count.textContent = NO_OF_MINES;

const checkGameEnd = () => {
	const won = checkWon(gameBoard),
		lost = checkLost(gameBoard);
	if (won || lost) {
		// true sets it to capture phase instead of bubble phase - Refer js Event Order
		board.addEventListener("click", stopProp, true);
		board.addEventListener("contextmenu", stopProp, true);
	}
	if (won) {
		gameMessage.textContent = "You Win 😄";
	} else if (lost) {
		gameMessage.textContent = "You Lose 😢";

		gameBoard.forEach(row =>
			row.forEach(tile => {
				// if tile was marked, but has mine, unmark it in order to reveal it as well
				if (tile.isMine) {
					if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
					revealTile(gameBoard, tile);
				}
			})
		);
	}
};

const stopProp = e => e.stopImmediatePropagation();
