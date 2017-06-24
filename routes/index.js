var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/newBoard', function(req, res, next) {
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
  res.status(200).send({board: board});
});

module.exports = router;
