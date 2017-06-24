var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Route for making a new board */
router.post('/newBoard', function(req, res, next) {
  //create an empty board of all 0s
  var board = [];
  for(var i = 0; i < req.body.rows; i++) {
    var row = [];
    for(var j = 0; j < req.body.cols; j++) {
      row.push(0);
    }
    board.push(row);
  }

  //place mines
  for(var i = 0; i < req.body.mines; i++) {
    var randRow = Math.floor(Math.random() * req.body.rows);
    var randCol = Math.floor(Math.random() * req.body.cols);
    while(board[randRow][randCol] !== 0) {
      randRow = Math.floor(Math.random() * req.body.rows);
      randCol = Math.floor(Math.random() * req.body.cols);
    }
    board[randRow][randCol] = 'M';
  }

  //update tiles to reflect # of adjacent mines
  for(var i = 0; i < req.body.rows; i++) {
    for(var j = 0; j < req.body.cols; j++) {
      if(board[i][j] !== 'M') {
        var count = 0;
        for(var xOffset = -1; xOffset <= 1; xOffset++) {
          for(var yOffset = -1; yOffset <= 1; yOffset++) {
            if(i + xOffset >= 0 && i + xOffset < req.body.rows && j + yOffset >= 0 && j + yOffset < req.body.cols) {
              if(board[i + xOffset][j + yOffset] === 'M') count++;
            }
          }
        }
        board[i][j] = count;
      }
    }
  }
  //send result
  res.status(200).send({board: board});
});

module.exports = router;
