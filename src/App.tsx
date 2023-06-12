import { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [key, setKey] = useState(localStorage.getItem(`key`) || ``)
  const [data, setData] = useState(JSON.parse(`["1d6"]`))
  const [newDice, setNewDice] = useState(``)
  const [result, setResult] = useState([0])
  const total = result.reduce((a, b) => a + b, 0)
  function ClearDice() {
    setData([])
    setResult([])
  }
  function addDice() {
    setData([...data,newDice])
    setResult([...result,0])
    setNewDice(``)
  }
  function Word(newDice: string) {
    const [numDice,numSides] = newDice.split(`d`).map(i => parseInt(i,10))
    // console.log(numDice,numSides)
    return `${numDice} of ${numSides}-sides dice!`
  }
  function Roll() {
    console.log(data)
    const options = {
      method: 'POST',
      url: 'https://dice-roll2.p.rapidapi.com/roll',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': 'dice-roll2.p.rapidapi.com'
      },
      data
    };
    axios.request(options)
    .then(res => res.data.diceResult)
    .then(data => {
      let sum = 0
      let retResult = []
      for (let result of data) {
        console.log(`+${result}`)
        retResult.push(result)
        sum += result
      }
      setResult(retResult)
      console.log(`Total of ${sum}`)
    })
  }
  return (
    <>
      <h1>Rolling Dice</h1>
      {total > 0 && <p>Total = {total}</p>}
      {total > 0 && <p>min = {Math.min(...result)}</p>}
      {total > 0 && <p>MAX = {Math.max(...result)}</p>}
      {/* {total > 0 && <p>Average (mean) = {result.reduce((a, b) => a + b, 0) / result.length}</p>} */}
      <div className="roll">
        <div className="rollIN">
          <ol>
            {data.map((item: string,index: number) => {
              return <li key={index}>{item}</li>
            })}
          </ol>
        </div>
        <div className="rollOUT">
          <ul>
            {result.map((item: number,index: number) => {
              return <li key={index}>{item}</li>
            })}
          </ul>
        </div>
      </div>
    <div className="input">
      <input type="text" id='key' value={key} placeholder={`KEY`} onChange={e => {
        localStorage.setItem(`key`, e.currentTarget.value)
        setKey(e.currentTarget.value)
      }} />
      <input type="text" id='newDice' value={newDice} placeholder={`1d6`} onChange={e => {
        setNewDice(e.currentTarget.value)
      }} />
      {/^\d+d\d+(\+\d+)?$/.exec(newDice) && 
      <button onClick={addDice}>Add {Word(newDice)}</button>
      }
    </div>
    <div className="btn">
      <button style={{background: `salmon`}} onClick={Roll}>Roll</button>
      <button style={{background: `red`}} onClick={ClearDice}>Remove All Dice</button>
    </div>
    </>
  )
}

export default App
