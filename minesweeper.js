export const TILE_STATUSES = {
	HIDDEN: "hidden",
	MINE: "mine",
	NUMBER: "number",
	MARKED: "marked",
};

const getRandomLocation = size => parseInt(Math.random() * size) % size;

const areSamePosition = (pos1, pos2) => {
	return pos1.x === pos2.x && pos1.y === pos2.y;
};

const getMinePositions = (boardSize, noOfMines) => {
	const positions = [];
	while (positions.length < noOfMines) {
		const position = {
			x: getRandomLocation(boardSize),
			y: getRandomLocation(boardSize),
		};
		if (!positions.some(pos => areSamePosition(pos, position)))
			positions.push(position);
	}
	return positions;
};

export const createBoard = (boardSize, noOfMines) => {
	const board = [];
	const minePositions = getMinePositions(boardSize, noOfMines);

	for (let x = 0; x < boardSize; x++) {
		const row = [];
		for (let y = 0; y < boardSize; y++) {
			const element = document.createElement("div");
			element.dataset.status = TILE_STATUSES.HIDDEN;

			const tile = {
				element,
				x,
				y,
				isMine: minePositions.some(pos =>
					areSamePosition(pos, { x, y })
				),
				// Getter/Setter for element status
				get status() {
					return this.element.dataset.status;
				},
				set status(value) {
					this.element.dataset.status = value;
				},
			};

			row.push(tile);
		}
		board.push(row);
	}
	return board;
};

export const markTile = tile => {
	if (tile.status === TILE_STATUSES.MARKED) {
		tile.status = TILE_STATUSES.HIDDEN;
		if (mine_count != null)
			mine_count.textContent = parseInt(mine_count.textContent) + 1;
	} else if (tile.status === TILE_STATUSES.HIDDEN) {
		tile.status = TILE_STATUSES.MARKED;
		if (mine_count != null)
			mine_count.textContent = parseInt(mine_count.textContent) - 1;
	}
	return;
};

export const revealTile = (board, tile) => {
	if (tile.status !== TILE_STATUSES.HIDDEN) return;
	if (tile.isMine) {
		tile.status = TILE_STATUSES.MINE;
		return;
	}
	tile.status = TILE_STATUSES.NUMBER;
	const adjacentTiles = getAdjacentTiles(board, tile);
	const adjacentMinesCount = adjacentTiles.filter(tile => tile.isMine).length;
	if (adjacentMinesCount) {
		tile.element.textContent = adjacentMinesCount;
	} else {
		adjacentTiles.forEach(adjTile => revealTile(board, adjTile));
	}
};

const getAdjacentTiles = (board, { x, y }) => {
	const dx = [1, 1, 1, 0, 0, -1, -1, -1];
	const dy = [1, -1, 0, 1, -1, 1, -1, 0];

	const adjTiles = [];
	for (let i = 0; i < dx.length; i++) {
		let posx = x + dx[i],
			posy = y + dy[i];
		const adjTile = board[posx]?.[posy];
		if (adjTile && adjTile.status !== TILE_STATUSES.NUMBER)
			adjTiles.push(adjTile);
	}
	return adjTiles;
};

export const checkWon = board =>
	board.every(row =>
		row.every(
			tile =>
				tile.status === TILE_STATUSES.NUMBER ||
				(tile.isMine &&
					(tile.status === TILE_STATUSES.MARKED ||
						tile.status === TILE_STATUSES.HIDDEN))
		)
	);

export const checkLost = board =>
	board.some(row => row.some(tile => tile.status === TILE_STATUSES.MINE));
