import { useState } from "react"
import { createElement } from "react"

function Square({value, onSquareClick, winningSquareStyle}){
    return (
            <button className="square" onClick={onSquareClick}>{value} style={winningSquareStyle}</button>
    )
}
function Board({xIsNext, setXisNext, squares, onPlay, winningSquares}){
    
    const winner = determineWinner(squares)
    
    const nextPlayer = winner ? `Winner: ${winner}` : xIsNext === null ?
            'Tie' : xIsNext === true ? 'Next player: X' : 'Next player: O' 
    
    function CreateSquares({iter}){        
        const divSquares = []
        for(let i = 0; i < 3; i++){
            divSquares.push(
                <Square value={squares[iter * 3 + i]} 
                    onSquareClick={()=>handleClick(iter * 3 + i)}
                    winningSquareStyle={()=>coloredSquares(winningSquares)}
                />
            )
        }
        return divSquares
    }
    
    function GameDivs(){
        const gSquares = []
        for(let j = 0; j < 3; j++){
            gSquares.push(
                <div className="board-row">
                    <CreateSquares iter={j}/>
                </div>
            )
        }
        return (gSquares)
    }

    function GameDivsCreateElement(){
        let i = 0
        const divs = []
        while(i < 3){
            const innerDivs = []
            for(let j = 0; j < 3; j ++){
                innerDivs.push(
                    <Square value={squares[i * 3 + j]} onSquareClick={()=>handleClick(i * 3 + j)}/> 
                )
            }
            divs.push(
                <div className="board-row">
                    {innerDivs}
                </div>
            )
            i++
        }
        return divs
    }

    return (
        <>
        <div className="turn">{nextPlayer}</div>
          <GameDivs/>
        </>
    )

    function handleClick(i){
        if(squares[i] || determineWinner(squares) || nextPlayer === 'Tie'){            
            return
        } 
        const nextSquares = squares.slice()
        if(xIsNext){
            nextSquares[i] = 'X'
        }
        else{
            nextSquares[i] = 'O'
        }
        onPlay(nextSquares)
    }

    function determineWinner(squares){
        const lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,4,8],
            [2,4,6],
            [0,3,6],
            [1,4,7],
            [2,5,8]
        ]
        let lastMove = false
        for(let i in lines){
            const [a,b,c] = lines[i]
            if(squares[a] && squares[b] && squares[c]){
                lastMove = true
            }else{
                lastMove = false
            }

            if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
                setXisNext(null)
                coloredSquares([a,b,c])
                return squares[a]//return the sign of the winner
            }
        }

        if(lastMove === true){
            setXisNext(null)
        }

        return null
    }
//develop the winning square styles function
    function coloredSquares(winSqs){
        return 
    }
}

export default function Game(){
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [xIsNext, setXisNext] = useState(true)
    const [currentMove, setCurrentMove] = useState(0)
    const currentSquares = history[currentMove]
    
    const moves = history.map((squares,move)=>{
        let description = ''

        if(move > 0){
            description = `Go to move ${move}`
        }else if(move === currentMove){
            description = `You are at move ${move}`
        }
        else{
            description = 'Go to game start'
        }
        
        const ListItem = ()=>{ 
                        if(move === currentMove && xIsNext === null){
                            return createElement('p', {className:'finalMove'}, 'No more moves')
                        }
                        else if(move === currentMove){
                            return createElement('p',null,`You are at move ${currentMove}`)
                        }
                        else{
                           return createElement('button',{onClick:()=>jumpTo(move)},description)
                        }
                    }

        return(
            <li key={move}>
                <ListItem/>
            </li>
        )
    })

    return(
        <div className="game">
            <div className="game-board">
                <Board 
                    xIsNext={xIsNext} setXisNext={setXisNext} 
                    squares={currentSquares} onPlay={handlePlay}
                    // winningSquares={colorizeSquares}
                    />
            </div>
            <div className="game-info">
                <ol className="moveList">{moves}</ol>
            </div>
            <div className="newGame">
                <button onClick={newGame}>New game</button>
            </div>
        </div>
    )

    function handlePlay(nextSquares){
        const nextHistory = [...history.slice(0,currentMove + 1),nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
        setXisNext(!xIsNext)    
    }
    
    function jumpTo(nextMove){
        setCurrentMove(nextMove)
        setXisNext(nextMove % 2 === 0)
    }

    function newGame(){
        let oList = document.getElementsByTagName('div .game-info')
        oList.innerHTML = 'You are at move 0'//BAD; against the ideas of react. Don't use js dom manipulation
        
    }
}

// style={{color: 'red'}} jsx syntax