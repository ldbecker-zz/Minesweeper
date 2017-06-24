const React = require('react');
const axios = require('axios');

class Board extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      rows: props.rows,
      cols: props.cols,
      mines: props.numMines,
      board: [],
      gameOver: false,
      cellsCleared: 0
    };

    this.clickCell = this.clickCell.bind(this);
    this.dblClickCell = this.dblClickCell.bind(this);
  }

  /* Listener for flag placement (CTRL + click) */
  dblClickCell(e) {
    e.preventDefault();

    //If flag is there, remove it and update cleared count
    if(e.target.innerHTML === '[F]') {
      e.target.innerHTML = '[ ]';
      this.setState({
        cellsCleared: this.state.cellsCleared - 1
      });
    } else {
      //if its not there, put it there and update cleared count
      this.setState({
        cellsCleared: this.state.cellsCleared + 1
      });
      e.target.innerHTML = '[F]';
      //Did we win?
      if(this.state.cellsCleared + this.state.mines === this.state.rows * this.state.cols) {
        alert('You Win!!! :-)');
      }
    }
  }

  /* Handler for clicking on tiles. */
  clickCell(e) {
    e.preventDefault();

    //Is the game over already?
    if(this.state.gameOver) {
      alert("Sorry, but you got exploded. Please make a new game.");
      return;
    }

    //Did we already click on the tile?
    if(e.target.innerHTML !== '[ ]' || e.target.innerHTML === '[F]') {
      return;
    }

    //Is it a flag placement, not a regular click?
    if(e.ctrlKey) {
      this.dblClickCell(e);
      return;
    }

    //The id property of the cell contains its matching board index
    var id = e.target.id.split(',');
    var row = parseInt(id[0]);
    var col = parseInt(id[1]);
   
    //Did we click a mine?
    if(this.state.board[row][col] === 'M') {
      this.setState({
        gameOver: true
      });
      e.target.innerHTML = '[' + this.state.board[row][col] + ']';
    } else if (this.state.board[row][col] === 0) {
      //remove all adjacent if we clicked on a 0 tile.
      var removed = {};
      var count = 0;
      var removeZeros = function(row, col) {
        //We should open the tile if we havent already, it is a valid index, and not a mine.
        if(removed[row + ',' + col] || !(row >= 0 && row < this.state.rows && col >= 0 && col < this.state.cols) || this.state.board[row][col] === 'M') {
          return;
        }
        document.getElementById(row + ',' + col).innerHTML = '[' + this.state.board[row][col] + ']';
        removed[row + ',' + col] = true;
        count += 1;
        //left adjacent
        removeZeros(row - 1, col);
        //right adjacent
        removeZeros(row + 1, col);
        //up adjacent
        removeZeros(row, col - 1);
        //down adjacent
        removeZeros(row, col + 1);
      }
      //bind this to removeZeros so we can access state.
      removeZeros = removeZeros.bind(this);
      removeZeros(row, col);
      //update cell cleared count
      this.setState({
          cellsCleared: this.state.cellsCleared + count
        });
    } else {
      e.target.innerHTML = '[' + this.state.board[row][col] + ']';
      this.setState({
        cellsCleared: this.state.cellsCleared + 1
      });

    }
  }

  /* Listener for receiving props from App. We make our board here */
  componentWillReceiveProps(newProps) {
    this.setState({
      rows: 0,
      cols: 0,
      mines: newProps.numMines
    });

    let context = this;

    axios.post('/newBoard', {rows: newProps.rows, cols: newProps.cols, mines: newProps.numMines})
    .then(function(resp) {
      context.setState({
        rows: resp.data.board.length,
        cols: resp.data.board[0].length,
        board: resp.data.board,
        gameOver: false,
        cellsCleared: 0
      });
    });
  }

  render() {
    let context = this;
    return (
        <div>
          {this.state.rows === 0 ? null :
            <div>
              {this.state.board.map(function(row, i) {
                return (
                    <div>
                      {row.map(function(cell, j) {
                        return <span id={i + ',' + j} 
                                     onClick={context.clickCell}
                                      >
                                     {'[ ]'}
                                </span>;
                      })}
                    </div>
                  )
              })}
              Cells Cleared: {this.state.cellsCleared} <br/>
              Total Mines: {this.state.mines}
            </div>
          }
        </div>
      )
  }
}

module.exports = Board;