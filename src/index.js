import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={
        props.winner && props.winner.includes(props.index)
          ? "square winner-square"
          : "square"
      }
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        index={i}
        winner={this.props.winner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    let col;
    let newCol = [1, 2, 3];
    const row = [1, 2, 3].map(row => {
      col = newCol;
      newCol = [];
      col = col.map(val => {
        const squareVal = row > 1 ? val + 3 : val;
        newCol.push(squareVal);
        return <div key={squareVal}>{this.renderSquare(squareVal)}</div>;
      });
      return (
        <div className="board-row" key={row}>
          {col}
        </div>
      );
    });
    return <div>{row}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      location: [],
      stepNumber: 0,
      xIsNext: true,
      sort: "asc"
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = this.state.location.slice(0, this.state.stepNumber + 1);
    let loc = this.calculateCoordenates(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      location: location.concat([loc])
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  calculateCoordenates(index) {
    const col = Math.ceil(index % 3) === 0 ? 3 : Math.ceil(index % 3);
    const row = Math.ceil(index / 3);
    return `col: ${col} row: ${row}`;
  }
  sortMoves() {
    const sorted = this.state.sort === "asc" ? "desc" : "asc";
    this.setState({
      sort: sorted
    });
  }
  newGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      location: [],
      stepNumber: 0,
      xIsNext: true,
      sort: "asc"
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const location = this.state.location;
    const sorted = this.state.sort === "asc" ? "desc" : "asc";
    let moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <a href="javascript:(void)"
            className={move === this.state.stepNumber ? "strong" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </a>
        </li>
      );
    });
    let locations = location.map((value, index) => {
      return (
        <li key={index}>
          <span> {value} </span>
        </li>
      );
    });
    if (this.state.sort === "desc") {
      moves = moves.reverse();
      locations = locations.reverse();
    }
    let status;
    if (winner) {
      status = "Winner: " + (this.state.xIsNext ? "O" : "X");
    } else if (this.state.stepNumber < 9) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else {
      status = "Is a draw!";
    }
    return (
      <div className="game-container">
      <div>
      <h1> Tic Tac Toe </h1>
      </div>
      <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          winner={winner}
          onClick={i => this.handleClick(i)}
        />
      </div>
      <div className="game-info-container">
        <div className="game-info">
          <h1
            className={
              winner ? "winner" : this.state.stepNumber < 9 ? "next" : "draw"
            }
          >
            {status}
          </h1>
          <div className="new-game">
          <button
            className="action-btn"
            onClick={() => {
              this.newGame();
            }}
          >
            {"New Game"}
          </button></div>
          </div>
          <div className="sort">
            <span className="sort-dir"> Sort {sorted} </span>
            <label className="switch">
              <input type="checkbox" onClick={() => this.sortMoves()} />
              <span className="slider round"> </span>
            </label>
          </div>
          <div className="moves-container">
          <ol>{moves}</ol>
          <div
          className={this.state.sort === "asc" ? "location" : "location-desc"}>
          <ol style={{ listStyle: "none" }}>{locations}</ol>
        </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
