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
  constructor(){
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }

  handleClick(i) {
    // Only allow changing the cell if it hasn't been set.
    const squares = this.state.squares.slice();
    if (squares[i] || calculateWinner(squares))
      return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });
  }

  renderSquare(css, i) {
    return (
      <Square css={css} value={this.state.squares[i]} onClick={() => this.handleClick(i)} />
    )
  }

  render(){
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Player: ' + winner.winner + ' won!';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return(
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(getCss(winner, 0), 0)}
          {this.renderSquare(getCss(winner, 1), 1)}
          {this.renderSquare(getCss(winner, 2), 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(getCss(winner, 3), 3)}
          {this.renderSquare(getCss(winner, 4), 4)}
          {this.renderSquare(getCss(winner, 5), 5)}
        </div>
        <div className="board-row">
          {this.renderSquare(getCss(winner, 6), 6)}
          {this.renderSquare(getCss(winner, 7), 7)}
          {this.renderSquare(getCss(winner, 8), 8)}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* ToDO */}</ol>
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
