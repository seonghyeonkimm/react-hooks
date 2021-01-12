// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Moves({onClickNext, onClickPrev}) {
  return (
    <div>
      <button onClick={onClickPrev}>prev</button>
      <button onClick={onClickNext}>next</button>
    </div>
  )
}

function Board({squares, selectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [history, setHistory] = useLocalStorageState('history', () => [
    Array(9).fill(null),
  ])

  const currentSqaures = history[currentStep] || Array(9).fill(null)
  const nextValue = calculateNextValue(currentSqaures)
  const winner = calculateWinner(currentSqaures)
  const status = calculateStatus(winner, currentSqaures, nextValue)

  function selectSquare(square) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (currentSqaures[square] || winner) return
    //
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    //
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    //
    // 🐨 set the squares to your copy
    const squaresCopy = [...currentSqaures]
    squaresCopy[square] = nextValue
    setHistory(prev => {
      const next = [...prev]
      next[currentStep] = squaresCopy
      return next
    })
  }

  function restart() {
    setHistory(prev => {
      const next = [...prev]
      next[currentStep] = Array(9).fill(null)
      return next
    })
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSqaures} selectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves
          onClickNext={() => {
            const prevCurrentStep = currentStep
            setCurrentStep(prev => prev + 1)
            setHistory(prev => {
              return prev.length - 1 === prevCurrentStep
                ? [...prev, Array(9).fill(null)]
                : prev
            })
          }}
          onClickPrev={() =>
            setCurrentStep(prev => {
              console.log('prev: ', prev)
              return prev === 0 ? prev : prev - 1
            })
          }
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
