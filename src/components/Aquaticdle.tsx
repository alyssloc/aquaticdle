import { useState, useEffect, useRef } from 'react';
import { SPECIES_DATA } from '../animals/species.ts';
import { MAX_ATTEMPTS } from './types.ts';
import Search from './Search.tsx'
import { shuffle } from './shuffle.ts'
import GithubLogo from '../assets/GitHub_Invertocat_White.png'; 

const getDailySpecies = () => {
    const today = new Date();
    const dateSeed = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate();
    
    // Selecting a random species 
    const pseudoRandom = Math.abs(Math.sin(dateSeed) * 10000);
    const index = Math.floor((pseudoRandom - Math.floor(pseudoRandom)) * SPECIES_DATA.length);
    
    return SPECIES_DATA[index];
};

//get today to check if the saved data is from today
const getTodayString = () => {
    const today = new Date();
    return `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
};


export default function Aquaticdle() {
    const images = import.meta.glob('/src/assets/images/*.{jpg,jpeg,png,webp,JPG}', { eager: true });

    const todayStr = getTodayString();

    // loading saved state before initializing
    const loadGameState = () => {
        const saved = localStorage.getItem('aquaticdleState');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.date === todayStr) {
                return parsed;
            }
        }
        return null;
    };

    const savedState = loadGameState();


    const [species] = useState(() => getDailySpecies());

    //loading from saved data if possible
    const [clues] = useState<string[]>(() => {
        if (savedState && savedState.clues) return savedState.clues;
        return shuffle([...species.clues]);
    });

    //check saved state first, then do to the default values
    const [attempts, setAttempts] = useState<number>(savedState ? savedState.attempts : 0);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>(savedState ? savedState.gameStatus : 'playing');
    const [guessedList, setGuessedList] = useState<string[]>(savedState ? savedState.guessedList : []);

    const [timeLeft, setTimeLeft] = useState<string>("");
    const isInitialLoad = useRef(true);

    //saving game state to local storage after anything happens
    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        const stateToSave = {
            date: todayStr,
            attempts,
            gameStatus,
            guessedList,
            clues
        };
        localStorage.setItem('aquaticdleState', JSON.stringify(stateToSave));
    }, [attempts, gameStatus, guessedList, clues, todayStr]);

    // calculate time until next midnight (when a new species will be selected)
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
            const diff = tomorrow - now.getTime();

            if (diff <= 0) return "00:00:00";

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
            const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
            const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

            return `${h}:${m}:${s}`;
        };

        // setting initial time interval
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    //images have same names as the species ids (species_id.jpg)
    const getImage = (imageName: string) => {
        for (const path in images) {
            if (path.includes(`/${imageName}.`)) {
                return (images[path] as { default: string })?.default || (images[path] as string);
            }
        }
        return '';
    };

    
    //reset to select a diff species, return attempts to 0, and clear the guess
    //const resetGame = () => {
        //setSpecies(SPECIES_DATA[Math.floor(Math.random() * SPECIES_DATA.length)]);
        //setAttempts(0);
        //setGuess("");
        //setGameStatus('playing');
        //setGuessedList([]);
    //};


    //update guess, # attempts, and guessed list, and check if guess was correct and
    //if the game is over
    const handleGuessSubmit = (input: string) => {
        const isCorrect = input.toLowerCase() === species.name.toLowerCase();
        const updatedAttempts = attempts + 1;

        //setGuess(input);
        setAttempts(updatedAttempts);
        setGuessedList((prev) => [...prev, input]);

        if (isCorrect) {
            setGameStatus('won');
        } else if (updatedAttempts >= MAX_ATTEMPTS) {
            setGameStatus('lost');
        }
    }

    const numCluesToReveal = gameStatus === 'playing' ? attempts + 1 : MAX_ATTEMPTS;
    const revealedClues = clues.slice(0, numCluesToReveal);

    //end of game screen
    return (
        <div className="game-container" style={{ 
            padding: '30px', 
            maxWidth: '500px', 
            margin: '40px auto', 
            marginBottom: '100px',
            marginTop: '75px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#eef8fe', 
            opacity: 0.9,
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)', 
            color: '#08022e' 
        }}>
            <h1 style={{ color: '#1a1a1a' }}>Aquaticdle</h1>
            <h3 style={{ color: '#1a1a1a' }}>Guess the marine, aquatic, or semiaquatic mammal</h3>
            <p style={{ color: '#1a1a1a' }}>Attempts: {attempts} / {MAX_ATTEMPTS}</p>
            
            <div className="clues-box" style={{ 
                background: '#f8f9fa', 
                color: '#08022e',
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginTop: 0, color: '#1a1a1a' }}>Clues:</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {revealedClues.map((clue, index) => {
                        let bgColor = 'transparent';
                        if (index < attempts) {
                            if (gameStatus === 'won' && index === attempts - 1) {
                                bgColor = 'rgba(0, 255, 0, 0.2)'; //green for correct guess
                            }
                            else {
                                bgColor = 'rgba(255, 0, 0, 0.15)'; //red for wrong guess
                            }
                    }
                        return (
                            <li key={index} style={{ 
                                marginBottom: '10px', 
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: bgColor,
                                border: '1px solid #d1d1d1'
                            }}>
                                {index + 1}. {clue}
                            </li>
                        );
                    })}
                </ul>
            </div>


            {gameStatus === 'playing' && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Search onSelect={handleGuessSubmit} guessedList={guessedList} />
                </div>
            )}

            {gameStatus !== 'playing' && (
                <div className="game-summary" style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    width: '100%',
                    boxSizing: 'border-box',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {gameStatus === 'won' ? (
                        <h1 style={{ color: 'green', margin: '10px 0' }}>Nice work!</h1>
                    ) : (
                        <h1 style={{ color: 'red', margin: '10px 0' }}>Nice try!</h1>
                    )}
                    
                    <h2 style={{ margin: '10px 0', color: '#1a1a1a' }}>{species.name}</h2>
                    <p style={{ margin: '5px 0' }}><i>Scientific Name: {species.scientificName}</i></p>
                    
                    {getImage(species.id) ? (
                        <img 
                            src={getImage(species.id)} 
                            alt={species.name} 
                            style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', margin: '15px 0', objectFit: 'cover' }} 
                        />
                    ) : (
                        <p style={{ color: 'gray' }}>[Image not found]</p>
                    )}
                    
                    <p style={{ margin: '10px 0', lineHeight: '1.4' }}><strong>Range:</strong> {species.range}</p>
                    
                    <div style={{ 
                        marginTop: '25px', 
                        marginBottom: '25px',
                        padding: '15px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px', 
                        border: '1px solid #e0e0e0',
                        display: 'inline-block',
                        minWidth: '200px'
                        }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Next Species In
                        </p>
                        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', fontVariantNumeric: 'tabular-nums' }}>
                            {timeLeft}
                        </p>
                        <a href="https://github.com/alyssloc/aquaticdle" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                            position: 'fixed',
                            bottom: '5px',
                            left: "50%",
                            marginTop: '0px',
                            marginBottom: '10px',
                            transform: 'translateX(-50%)',
                            zIndex: "-1000"
                        }}>
                        <img 
                            src={GithubLogo} 
                            alt="GitHub Repo" 
                            style={{ width: '50px', height: '50px', display: 'block' }} 
                        />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}