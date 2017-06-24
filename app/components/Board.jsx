const React = require('react');
const axios = require('axios');

class Board extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      rows: props.rows,
      cols: props.cols,
      mines: props.numMines,
      board: []
    };

    if(localStorage.getItem('state')) {
      //reload state
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      rows: newProps.rows,
      cols: newProps.cols,
      mines: newProps.numMines
    });

    let context = this;

    axios.post('/newBoard', {rows: newProps.rows, cols: newProps.cols, mines: newProps.numMines})
    .then(function(resp) {
      context.setState({
        board: resp.data.board
      });
    });
  }

  render() {
    return (
        <div>
          {this.state.rows === 0 ? null :
            <div>
              {this.state.board.map(function(row, i) {
                return row;
              })}
            </div>
          }
        </div>
      )
  }
}

module.exports = Board;