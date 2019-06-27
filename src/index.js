import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(<button className="square" onClick={props.onClick}>
        {props.value}
        </button>);
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square onClick={() => { this.props.handleClick(i) }} value={this.props.squares[i]} />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [{squares: new Array(9).fill(null)}],
            xIsNext: true,
            currentMove: 0,
        };
    }

    jumpTo(move){
        const current = this.state.history[move];
        const squares = current.squares.slice();

        this.setState({
            currentMove: move,
            xIsNext: calculateXIsNext(move),
            winner: calculateWinner(squares)
        });
        
    }

    handleClick(i) {

        const history = this.state.history;
        let currentMove = this.state.currentMove;
        const current = history[currentMove];
        const squares = current.squares.slice();

        //Ignore click if a square has already been played
        //Ignore click if there is a winner
        if( squares[i] ||  this.state.winner ){ 
            return; 
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        currentMove += 1;

        this.setState({
            history: history.splice(0, currentMove).concat([{squares: squares}]) ,
            xIsNext: calculateXIsNext(currentMove),
            winner: calculateWinner(squares),
            currentMove: currentMove,
        });
    }

    render() {
        const history = this.state.history;
        const currentMove = this.state.currentMove;
        const current = history[currentMove]; //history[history.length - 1];
        let status = !this.state.winner ? 
                `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
            :   `The winner is ${this.state.winner}`

        const moves = history.map((step, move)=>{
            const desc = move ?
                `Go to move #${move}`:
                `Go to game start`;
            return <li key={move}><button onClick={() => this.jumpTo(move)}>{desc}</button></li>;
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board handleClick={(i) => this.handleClick(i)} squares={current.squares}/>
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

function calculateXIsNext(move){
    return (move % 2 === 0);
}

function calculateWinner(squares){
    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let winner = null;
    winningLines.forEach(([a, b, c])=>{
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            winner = squares[a];
            return;
        }
    });

    return winner;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
