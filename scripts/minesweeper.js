	"use strict";

	class MineSweeper {

		constructor(width, height, difficulty) {

			this.generateBoard 		= this.generateBoard.bind(this);
			this.setBombs 			= this.setBombs.bind(this);
			this.calculateNumbers 	= this.calculateNumbers.bind(this);
			this.getSurrounding 	= this.getSurrounding.bind(this);
			this.drawBoard 			= this.drawBoard.bind(this);
			this.tileClick 			= this.tileClick.bind(this);
			this.revealNumbers 		= this.revealNumbers.bind(this);
			this.revealBombs 		= this.revealBombs.bind(this);
			this.hasWon 			= this.hasWon.bind(this);
			this.gameOver 			= this.gameOver.bind(this);
			this.startTimer 			= this.startTimer.bind(this);
			
			this.container = document.querySelector('#board');
			this.container.innerHTML = '';

			this.board = [];
			this.bomb_list = [];

			this.isGameOver = false;

			this.width = width;
			this.height = height;
			this.difficulty = difficulty;

			this.number_of_open_tiles = 0;
			this.number_of_tiles = this.width * this.height;

			if ( this.difficulty < 1 ) {
				this.number_of_bombs = Math.ceil( this.number_of_tiles * this.difficulty );
			} else { // extreme mode
				this.number_of_bombs = this.number_of_tiles - 1;
			}

			document.querySelector('#number_of_bombs').innerHTML = this.number_of_bombs;

			this.time_elapsed = 0;
			this.timer;

			this.generateBoard();
			this.setBombs();
			this.calculateNumbers();
			this.drawBoard();
		}

		startTimer() {
			this.timer = setInterval(() => {
				this.time_elapsed++;
				document.querySelector('#time_elapsed').innerHTML = `${this.time_elapsed} seconds`;
			}, 1000);
		}

		hasWon() {
			if ( this.number_of_open_tiles != (this.number_of_tiles - this.number_of_bombs) ) {
				return;
			}

			this.gameOver();

			alert('CONGRATULATIONS!');
		}

		gameOver() {
			this.isGameOver = true;
			clearInterval(this.timer);
		}

		revealBombs() {
			this.bomb_list.map(bomb => {
				let tile = document.querySelector(`#tile_${bomb[0]}_${bomb[1]}`);
					tile.className = 'tile bomb';
			});
		}

		revealNumbers(tile) {

			if ( tile.is_bomb || tile.is_open ) {
				return;
			}

			tile.is_open = true;
			this.number_of_open_tiles++;

			let tile_element = document.querySelector(`#tile_${tile.y}_${tile.x}`);
				tile_element.className = 'tile reveal';

			if ( tile.number > 0 ) {
				tile_element.innerHTML = tile.number;
			} else {
				this.getSurrounding(tile.x, tile.y, false)
					.map(side_tile => this.revealNumbers(side_tile));
			}

		}

		tileClick(event) {
			if ( ! event.target || this.isGameOver ) {
				return;
			}

			let tile = this.board[event.target.getAttribute('y')][event.target.getAttribute('x')];

			if ( tile.is_bomb ) {
				this.gameOver();
				this.revealBombs();
				return;
			}

			if ( ! this.timer ) {
				this.startTimer();
			}

			this.revealNumbers(tile);
			this.hasWon();
		}

		getSurrounding(x, y, diagonal = false) {
			let tiles = [];

			let positions = [
				[-1, 0],	// top center
				[0, -1],	// medium left
				[0, 1],		// medium right
				[1, 0],		// bottom center
			];

			if ( diagonal ) {
				positions.push([-1, -1]); 	// top left
				positions.push([-1, 1]);	// top right
				positions.push([1, -1]);	// bottom left
				positions.push([1, 1]);		// bottom right
			}

			positions.map(pos => {

				let tile_y = y + pos[0];
				let tile_x = x + pos[1];

				if ( tile_y < 0 || tile_y == this.height || tile_x < 0 || tile_x == this.width ) {
					return;
				}

				tiles.push(this.board[tile_y][tile_x]);
			});

			return tiles;
		}

		calculateNumbers() {
			this.board.map((arr, y) => arr.map((tile, x) => {
				if ( tile.is_bomb ) {
					return;
				}

				tile.number = 0;

				this.getSurrounding(x, y, true).map(side_tile => {
					if ( side_tile.is_bomb ) {
						tile.number++;
					}
				});
			}));
		}

		getRandomPosition(arr) {
			return Math.floor( Math.random() * arr.length );
		}

		setBombs() {
			let i = 0;

			while (i < this.number_of_bombs) {
				let y = this.getRandomPosition(this.board);
				let x = this.getRandomPosition(this.board[y]);
				let tile = this.board[y][x];

				if ( tile.is_bomb ){
					continue;
				}

				tile.is_bomb = true;

				this.bomb_list.push([y, x]);

				i++;
			}
		}

		generateBoard() {

			for (let y = 0; y < this.height; y++) {
				this.board[y] = [];

				for(let x = 0; x < this.width; x++) {
					this.board[y][x] = { x, y };
				}
			}

		}

		drawBoard() {

			this.board.map((arr, y) => {
				let row = document.createElement('div');
					row.className = 'row';

				arr.map((_, x) => {

					let tile = document.createElement('div');
						tile.id = `tile_${y}_${x}`;
						tile.className = 'tile';
						tile.setAttribute('y', y);
						tile.setAttribute('x', x);
						tile.addEventListener('click', this.tileClick);

						// right click
						tile.oncontextmenu = () => {
							if ( this.isGameOver ) {
								return false;
							}

							tile.className = 'tile flag';
							return false;
						}

					row.appendChild(tile);
				});

				this.container.appendChild(row);
			});
		}

	}