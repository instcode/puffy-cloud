// Gomoku Master (C) 2009 by instcode

var Gomoku = function Gomoku() {
	this.moves = [];
	this.turn = Gomoku.MAN;
	
	var gomoku = this;

	for (var cell = 0; cell < Gomoku.BOARDSIZE; cell++) {
		this.moves[cell] = Gomoku.EDGE;
	}
	
	this.getMove = function(cell) {
		return this.moves[cell];
	}
	
	this.makeMove = function(cell) {
		if (gomoku.isValid(cell)) {
			gomoku.moves[cell] = gomoku.turn;
			gomoku.turn = Gomoku.MAN + Gomoku.COM - gomoku.turn;
			return gomoku.check(cell, gomoku.moves[cell]);
		}
		return false;
	}
	
	this.check = function(cell, side) {
		var isFiveInARow = false;
		for (var direction = 0; direction < 4; direction++) {
			var backCount = 0, forwardCount = 0;
			var move = cell;
			
			while (this.moves[move -= Gomoku.DIRECTIONS[direction]] == side) {
				backCount++;
			}

			move = cell;
			while (this.moves[move += Gomoku.DIRECTIONS[direction]] == side) {
				forwardCount++;
			}

			if (backCount + forwardCount == 4) {
				isFiveInARow = true;
				break;
			}
		}
		return isFiveInARow;
	}
	
	this.isValid = function(cell) {
		return (cell >= 0 && cell < Gomoku.BOARDSIZE && this.moves[cell] == Gomoku.EMPTY);
	}
	
	this.reset = function() {
		for (var col = Gomoku.TOPLEFT; col < Gomoku.BOTRIGHT; col += Gomoku.EX_ROWSIZE) { 
			for (var row = 0; row < Gomoku.ROWSIZE; row++) {
				gomoku.moves[row + col] = Gomoku.EMPTY;
			}
		}
	}
}

Gomoku.CROSS = 0;
Gomoku.NOUGHT = 1;
Gomoku.MAN = 0;
Gomoku.COM = 1;
Gomoku.EMPTY = 2;
Gomoku.EDGE = 3;
Gomoku.ROWSIZE = 15;
Gomoku.EX_ROWSIZE = Gomoku.ROWSIZE + 2;
Gomoku.BOARDSIZE = Gomoku.EX_ROWSIZE * Gomoku.EX_ROWSIZE;
Gomoku.TOPLEFT = Gomoku.EX_ROWSIZE + 1;
Gomoku.BOTRIGHT = Gomoku.BOARDSIZE - Gomoku.EX_ROWSIZE - 1;
Gomoku.DIRECTIONS = new Array(1, Gomoku.EX_ROWSIZE, Gomoku.EX_ROWSIZE + 1, Gomoku.EX_ROWSIZE - 1);

var GomokuUI = function GomokuUI(handler) {
	var ui = this;
	var gomoku = new Gomoku();
	var board = new Entity("board", new Sprite("./images/board.png", GomokuUI.BOARD_DIAMETER, GomokuUI.BOARD_DIAMETER, 1, 1));
	var pieces = new Sprite("./images/pieces.png", GomokuUI.PIECES_DIAMETER * 2, GomokuUI.PIECES_DIAMETER * 2, 2, 2);
		
	var view = document.getElementById("view");	
	view.appendChild(board.element);
	
	var getRelativeCoordinates = function(event, obj) {
		var x = 0;
		var y = 0;
		var valueOf = function(value) {
			var n = parseInt(value);
			if (isNaN(n)) {
				return 0;
			}
			return n;
		}

		while (obj = obj.offsetParent) {
			var style = window.getComputedStyle(obj, null);
			var offset = {
				x: valueOf(style.left) + valueOf(style.paddingLeft) + valueOf(style.marginLeft),
				y: valueOf(style.top) + valueOf(style.paddingTop) + valueOf(style.marginTop)};
			x -= offset.x;
			y -= offset.y;
		}
		return {left: x, top: y};
	}
	
	board.element.onclick = function (event) {
		//*/ Bye IE!
		if (event.which != 1) {
			return;
		}
		//*/
		var obj = board.element;
		var offset = $(obj).offset();
		//var offset = getRelativeCoordinates(event, obj);
		var x = event.pageX - offset.left;
		var y = event.pageY - offset.top;
		
		var cell = ui.pointToMove(x, y);
		handler.moveMade(cell);
	};

	for (var col = Gomoku.TOPLEFT; col < Gomoku.BOTRIGHT; col += Gomoku.EX_ROWSIZE) { 
		for (var row = 0; row < Gomoku.ROWSIZE; row++) {
			var cell = row + col;
			var entity = new Entity("cell-" + cell, pieces);
			var top = GomokuUI.HOTSPOT_Y + ((Math.floor(cell / Gomoku.EX_ROWSIZE)) - 1) * GomokuUI.CELL_DIAMETER;
			var left = GomokuUI.HOTSPOT_X + ((cell % Gomoku.EX_ROWSIZE) - 1) * GomokuUI.CELL_DIAMETER;
			entity.setPosition(left, top);
			board.add(cell, entity);
		}
	}
	
	this.makeMove = function(cell) {
		var won = gomoku.makeMove(cell);
		ui.drawMove(cell);
		return won;
	}
	
	this.getTurn = function() {
		return gomoku.turn;
	}
	
	this.restart = function() {
		gomoku.reset();
		ui.drawBoard();
	}

	this.pointToMove = function(x, y) {
		var cell = parseInt((x - GomokuUI.OFFSET_X) / GomokuUI.CELL_DIAMETER)
			+ (parseInt((y - GomokuUI.OFFSET_Y) / GomokuUI.CELL_DIAMETER) + 1) * Gomoku.EX_ROWSIZE + 1;
		return cell;
	}

	this.drawMove = function(cell) {
		var move = gomoku.getMove(cell);
		var entity = board.get(cell);
		if (move != Gomoku.EDGE) {
			if (move == Gomoku.EMPTY) {
				entity.clear();
			}
			else {
				entity.setFrame(move);
				entity.draw();
			}
		}
	}

	this.drawBoard = function() {
		board.draw();
		for (var cell = 0; cell < Gomoku.BOARDSIZE; cell++) {
			ui.drawMove(cell);
		}
	}
}

GomokuUI.BOARD_IMAGE = 0;
GomokuUI.STONE_IMAGE = 1;
GomokuUI.PIECES_DIAMETER = 17;
GomokuUI.CELL_DIAMETER = 20;
GomokuUI.BOARD_DIAMETER = 302;
GomokuUI.OFFSET_X = 1;
GomokuUI.OFFSET_Y = 1;
GomokuUI.HOTSPOT_X = 3;
GomokuUI.HOTSPOT_Y = 2;
