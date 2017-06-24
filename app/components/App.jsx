const React = require('react');
const ReactDOM = require('react-dom');
const Board = require('./Board.jsx');

class App extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      rows: 0,
      cols: 0,
      numMines: 0
    };

    this.newGameSubmit = this.newGameSubmit.bind(this);
  }

  newGameSubmit(e) {
    e.preventDefault();
    var numRows = parseInt(document.getElementById('rows').value);
    if(isNaN(numRows) || numRows <= 0) {
      alert('Please enter a valid number of rows.');
      return;
    }
    var numCols = parseInt(document.getElementById('cols').value);
    if(isNaN(numCols) || numCols <= 0) {
      alert('Please enter a valid number of cols.');
      return;
    }
    var numMines = parseInt(document.getElementById('mines').value);
    if(isNaN(numMines) || numMines <= 0) {
      alert('Please enter a valid number of mines.');
      return;
    }
    if(numMines >= numCols * numRows) {
      alert('You probably should not have more mines than tiles...');
      return;
    }
    this.setState({
      rows: numRows,
      cols: numCols,
      numMines: numMines
    });
  }

  render() {
    return (
        <div>
          Instructions: First, create a board below. To play: Click on tiles to reveal them, hold CTRL and click to place a flag.
          <Board rows={this.state.rows} cols={this.state.cols} numMines={this.state.numMines}/><br/>
          <form onSubmit={this.newGameSubmit}>
            # Rows: <input type="text" id="rows"></input><br/>
            # Cols: <input type="text" id="cols"></input><br/>
            # Mines: <input type="text" id="mines"></input><br/>
            <button type="submit">Make New Game</button>
          </form>
        </div>
      );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));