import { languages } from "./languages.js";
import React from "react"
import clsx from "clsx";

export default function App() {

  // States
  const [currentWord, setCurrentWord] = React.useState("react");
  const [guessedLetter, setGuessedLetter] = React.useState([]);

  // Static Values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  // Derived Values
  const letterArray = currentWord.split("");
  const alphabetArray = alphabet.split("");
  const wrongGuessCount = guessedLetter.filter(letter => !currentWord.includes(letter)).length;

  const languageElements = languages.map((lan, index) => {
    return(
      <span 
        className={`chip-element ${index < wrongGuessCount ? "lost" : ""}`}
        key={lan.name}
        style={{backgroundColor: lan.backgroundColor, color: lan.color}}>
          {lan.name}
      </span>);
  })

  const isGameWon = currentWord.split("").every(letter => guessedLetter.includes(letter));
  const isGameLost = (wrongGuessCount >= (languageElements.length - 1)) ? true : false;

  const isGameOver = isGameWon || isGameLost;

  const letterElements = letterArray.map((letter, index) => {
    return(
      <span
        key={index}
        className="letter">
        {guessedLetter.includes(letter) ? letter.toUpperCase() : ""}
      </span>
    )
  })

  const alphabetElements = alphabetArray.map((letter, index) => {
    return(
      <button
        key={index}
        onClick={()=>letterClicked(letter)}
        className={
          clsx("alphabet-button",
          guessedLetter.includes(letter) && (currentWord.includes(letter) ? 
          "alphabet-button-correct" : 
          "alphabet-button-wrong"
        ))}
        >
          {letter.toUpperCase()}
        </button>
    )
  })

  function letterClicked(letter){
    setGuessedLetter(prevState => 
      prevState.includes(letter) ? 
      [...prevState] : 
      [...prevState, letter]);
  }

  function renderGameStates(){
    if(!isGameOver){
      return null;
    }

    if(isGameWon){
      return(
      <>
        <h2>You Win!</h2>
        <p>Well done! 🎉</p>
      </>);
    }
    else{
      return(
      <>
        <h2>Game Over!</h2>
        <p>You lose! Better start learning Assembly 😭</p>
      </>);
    }
  }

  return (
    <>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the 
          programming world safe from Assembly</p>
        <section className=
        { 
          isGameWon ? "status-bar status-bar-won" : isGameLost ? 
          "status-bar status-bar-lost" : 
          "status-bar"
          }>
          {renderGameStates()}
        </section>
      </header>
      <section className="chip-section">
        {languageElements}
      </section>
      <section className="letter-section">
        {letterElements}
      </section>
      <section className="keyboard">
        {alphabetElements}
      </section>
      {isGameOver &&<button className="new-game">New Game</button>}
    </>
  )
}
