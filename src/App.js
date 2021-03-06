import React, { Component } from 'react';
import Toggle from 'react-toggle'

function Square(props) {
  return (
    <button className={props.css} onClick={props.onClick}>
      {props.value}
    </button>
    );
}

class Board extends Component {
  renderSquare(i) {
    return (
      <Square
      key={i}
      css={getCss(this.props.winner, this.props.allSquaresFilled, this.props.movePos, i)}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />
    );
  }

  render(){
    var board = [];
    var row = [];
    for (let r = 0; r < 3; r++) {
      row = []
      for (let c = 0; c < 3; c++) {
        row.push(this.renderSquare(c + r * 3));
      }
      board.push(
      <div key={r} className="board-row">
        {row}
      </div>
      );
    }

    var comp = (
      <div>
        {board}
      </div>
    );

    return comp;
  }
}

class Game extends Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movePos: -1 ,
      }],
      stepNumber: 0,
      xIsNext: true,
      sortIncreasing: true
    };
  }

  handleSortChange(event){
   const checked = event.target.checked;
    this.setState({
      sortIncreasing: checked
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // Only allow changing the cell if it hasn't been set.
    if ((calculateWinner(squares) != null) || squares[i])
      return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        movePos: i
      }]),
      stepNumber : history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false: true,
    });
  }

  render() {
    const current = this.state.history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const allSquaresFilled = allFilled(current.squares);
    const movePos = this.state.history[this.state.stepNumber].movePos;

    //Sort the history in increasing or decreasing order
    const history = this.state.sortIncreasing ? (this.state.history.slice(0,
     this.state.history.length)) : (this.state.history.slice(0,
     this.state.history.length)).reverse();

    const moves = history.map((move, i) => {
      const desc = move.movePos >= 0 ? move.squares[move.movePos] + ' Move (' + (move.movePos % 3 + 1)  + ',' + parseInt(move.movePos/3 + 1, 10) + ')' : 'Game start';
      const bold = (current === move);
      return (
        <li key={i}>
          <div className={bold? "move-link" : ""}>
            <a href="#" onClick={() => this.jumpTo(this.state.sortIncreasing ? i : history.length - i - 1)}>{desc}</a>
          </div>
        </li>
      )
    })
    let status;
    if (winner) {
      status = 'Player: ' + winner.winner + ' won!';
    }
    else if (allSquaresFilled){
      status = 'No Winner!'
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board" >
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          winner={winner}
          allSquaresFilled={allSquaresFilled}
          movePos={movePos}
          />
        </div>
        <div className="game-info">
          <div className="status">
            {status}
          </div>
          <div className="toggle">
            <label>Sort Moves increasing:&nbsp;</label>
            <Toggle
              defaultChecked={this.state.sortIncreasing}
              onClick={(e) => this.handleSortChange(e)}
              />
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {line: lines[i], winner: squares[a]};
    }
  }
  //Not a win
  return null;
}

function allFilled(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]){
      //An empty square
      return false;
    }
  }
  //All squares full
  return true;
}

function getCss(winner, allFilled, lastMovePos, pos) {
  if (winner && (winner.line[0] === pos || winner.line[1] === pos || winner.line[2] === pos))
      return "square winsquare";
  else if (!winner && allFilled && (pos === 0 || pos === 2 || pos === 4 || pos === 6 || pos === 8))
    return "square losesquare";
  else
  {
    if (lastMovePos === pos && !winner && !allFilled){
      return "currentsquare square";
    }
    else {
      return "square";
    }
  }
}

export default Game;
