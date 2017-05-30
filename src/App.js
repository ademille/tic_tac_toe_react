import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

/*
class Square extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <button className="square" onClick={() => this.props.clickCallback()}>
        {this.props.value}
      </button>
    );
  }
}
*/

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
      css={getCss(this.props.winner, i)}
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

    //var board2 = (
    //  <div>
    //    <div className="board-row">
    //      {this.renderSquare(0)}
    //      {this.renderSquare(1)}
    //      {this.renderSquare(2)}
    //    </div>
    //    <div className="board-row">
    //      {this.renderSquare(3)}
    //      {this.renderSquare(4)}
    //      {this.renderSquare(5)}
    //    </div>
    //    <div className="board-row">
    //      {this.renderSquare(6)}
    //      {this.renderSquare(7)}
    //      {this.renderSquare(8)}
    //    </div>
    //  </div>
    //);

    //return board2;
  }
}

class Game extends Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // Only allow changing the cell if it hasn't been set.
    if (calculateWinner(squares) || squares[i])
      return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
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
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move : 'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      )
    })
    let status;
    if (winner) {
      status = 'Player: ' + winner.winner + ' won!';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
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

function getCss(winner, pos) {
  if (winner && (winner.line[0] === pos || winner.line[1] === pos || winner.line[2] === pos))
      return "winsquare";
  else
    return "square";
}

export default Game;
