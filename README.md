# Aquaticdle

A daily Wordle-inspired guessing game for aquatic, semiaquatic, and marine mammals (currently excluding the semi-aquatic members of the sub-family sigmodontinae and the families muridae, and thryonomyidae). Players have six tries to guess the mystery animal using revealed clues, family hints, and range info.


## Features

**Daily Synchronized Puzzles**: Uses a UTC date-seeded algorithm so everyone gets the same daily mammal, regardless of timezone.

**Session Persistence**: Saves active game state—guesses, revealed clues, and win/loss status—in localStorage.  

**Calendar Archive**: Browse and play past puzzles starting from August 6th, 2026 using React Router.  

**Easy Score Sharing**: Generates custom text grid scorecards using the mobile Web Share API, with a automatic desktop clipboard fallback.  

**Keyboard-Navigable Autocomplete Search**: Includes arrow key selection, enter-to-submit, click-outside dismissal, and filtering out already-guessed species. 
 
**First-Time User Onboarding**: Automatically triggers a tutorial modal popup after a 1-second delay for first-time visitors via localStorage tracking.  
 

## Tech Stack

**Frontend**: React, TypeScript

**APIs**: LocalStorage, Web Share API, Clipboard API

**Build Tool**: Vite


## How it works

1. Read the revealed clues for the current attempt.  
2. Search and submit a species guess.  
3. Check the feedback:  
    Green: You guessed the exact species.  
    Yellow: Wrong species, but right biological family.  
    Red: Wrong species and wrong family.  
4. Hit Share Results to copy your score grid and share with friends



## Link

https://aquaticdle.com
