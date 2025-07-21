import { languages } from "./languages.js";
import React from "react"
import clsx from "clsx";
import { getFarewellText, randomWord } from "./utils.js";
import Confetti from 'react-confetti'

export default function App() {

  // States
  const [currentWord, setCurrentWord] = React.useState(() => randomWord());
  const [guessedLetter, setGuessedLetter] = React.useState([]);

  // Static Values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  // Derived Values
  const letterArray = currentWord.split("");
  const alphabetArray = alphabet.split("");
  const wrongGuessCount = guessedLetter.filter(letter => !currentWord.includes(letter)).length;
  const isGuessedLastCorrect = currentWord.includes(guessedLetter[guessedLetter.length - 1]);

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
        className={guessedLetter.includes(letter) ? "letter" : "letter missed-letter"}>
        {!isGameLost ? 
        (guessedLetter.includes(letter) ? 
        letter.toUpperCase() : "") : 
        (letter.toUpperCase())}
      </span>
    )
  })

  function letterClicked(letter){
    setGuessedLetter(prevState => 
      prevState.includes(letter) ? 
      [...prevState] : 
      [...prevState, letter]);
  }

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
        disabled={isGameOver}
        aria-disabled={guessedLetter.includes(letter)}
        aria-label={`Letter ${letter}`}
        >
          {letter.toUpperCase()}
        </button>
    )
  })

  function renderGameStates(){
    if((!isGameOver && !isGuessedLastCorrect) && guessedLetter.length > 0){
      return(
        <>
          <h2>{getFarewellText(languages[wrongGuessCount - 1].name)}</h2>
        </>
      )
    }
    else if(!isGameOver && isGuessedLastCorrect){
      return null;
    }
    else if(!isGameOver){
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

  function classNaming(){
    if(isGameOver){
      if(isGameWon) {return "status-bar status-bar-won"}
      else{return "status-bar status-bar-lost"}

    }else{
      if(!isGuessedLastCorrect && guessedLetter.length > 0){return "status-bar status-bar-wrong"}
      else{return "status-bar"}
    }
  }

  function restartTheGame(){
    setCurrentWord(randomWord());
    setGuessedLetter([]);
  }

  return (
    <>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the 
          programming world safe from Assembly</p>

        <section 
        aria-live="polite" 
        role="status" 
        className={classNaming()}>
          {renderGameStates()}
        </section>
      </header>
      <section className="chip-section">
        {languageElements}
      </section>
      <section className="letter-section">
        {letterElements}
      </section>

      {/*This section is not rendered into the screen. This is to increase the accessibility */}
      <section
        className="sr-only" 
        aria-live="polite" 
        role="status"
      >
        <p>
            {currentWord.includes(guessedLetter[guessedLetter.length - 1]) ? 
                `Correct! The letter ${guessedLetter[guessedLetter.length - 1]} is in the word.` : 
                `Sorry, the letter ${guessedLetter[guessedLetter.length - 1]} is not in the word.`
            }
            You have {languages.length - 1} attempts left.
        </p>
        <p>Current word: {currentWord.split("").map(letter => 
        guessedLetter.includes(letter) ? letter + "." : "blank.")
        .join(" ")}</p>
      </section>

      <section className="keyboard">
        {alphabetElements}
      </section>
      {isGameOver &&<button className="new-game" onClick={() => restartTheGame()}>New Game</button>}
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000}/>}
    </>
  )
}
