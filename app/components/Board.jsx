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

  dblClickCell(e) {
    e.preventDefault();

    e.target.innerHTML = '[F]';
  }

  clickCell(e) {
    e.preventDefault();

    if(this.state.gameOver) {
      alert("Sorry, but you got exploded. Please make a new game.");
      return;
    }

    if(e.target.innerHTML !== '[ ]') {
      return;
    }

    if(e.ctrlKey) {
      this.dblClickCell(e);
      return;
    }

    var id = e.target.id.split(',');
    var row = parseInt(id[0]);
    var col = parseInt(id[1]);
   
    //document.getElementById(e.target.id).innerHTML = '[' + this.state.board[row][col] + ']';
    if(this.state.board[row][col] === 'M') {
      this.setState({
        gameOver: true
      });
      e.target.innerHTML = '[' + this.state.board[row][col] + ']';
    } else if (this.state.board[row][col] === 0) {
      //remove all adjacent zeros
      var removed = {};
      var count = 0;
      var removeZeros = function(row, col) {
        if(removed[row + ',' + col] || !(row >= 0 && row < this.state.rows && col >= 0 && col < this.state.cols) || this.state.board[row][col] !== 0) {
          return;
        }
        document.getElementById(row + ',' + col).innerHTML = '[0]';
        removed[row + ',' + col] = true;
        count += 1;
        //left
        removeZeros(row - 1, col);
        //right
        removeZeros(row + 1, col);
        //up
        removeZeros(row, col - 1);
        //down
        removeZeros(row, col + 1);
      }
      removeZeros = removeZeros.bind(this);
      removeZeros(row, col);
      this.setState({
          cellsCleared: this.state.cellsCleared + count
        });
    } else {
      e.target.innerHTML = '[' + this.state.board[row][col] + ']';
      if(this.state.cellsCleared + this.state.mines + 1 === this.state.rows * this.state.cols) {
        alert('You Win!!! :-)');
      }
      this.setState({
        cellsCleared: this.state.cellsCleared + 1
      });

    }
  }

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