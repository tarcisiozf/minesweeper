	"use strict";

	window.oncontextmenu = () => false;

	var game;

	document.querySelector('#start').addEventListener('click', () => {

		let difficulty_table = {
			easy: 0.1,
			medium: 0.2,
			hard: 0.4,
			extreme: 1,
		}
		
		let width_el = document.querySelector('#width');
		let height_el = document.querySelector('#height');
		let difficulty_el = document.querySelector('#difficulty');

		let width = Number(width_el.value);
		let height = Number(height_el.value);
		let difficulty = difficulty_el.value;

		if ( width < 10 ) {
			alert('The minimum width is 10!');
			width_el.value = 10;
			return;
		}

		if ( height < 10 ) {
			alert('The minimum height is 10!');
			height_el.value = 10;
			return;
		}

		game = new MineSweeper(width, height, difficulty_table[difficulty]);
	});