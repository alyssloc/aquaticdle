import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SPECIES_DATA } from '../animals/species.ts';
import { MAX_ATTEMPTS } from './types.ts';
import Search from './Search.tsx';
import { shuffle } from './shuffle.ts';
import GithubLogo from '../assets/GitHub_Invertocat_White.png'; 

const getDailySpecies = (targetDate: Date) => {
    const dateSeed = targetDate.getUTCFullYear() * 10000 + (targetDate.getUTCMonth() + 1) * 100 + targetDate.getUTCDate();
    const pseudoRandom = Math.abs(Math.sin(dateSeed) * 10000);
    const index = Math.floor((pseudoRandom - Math.floor(pseudoRandom)) * SPECIES_DATA.length);
    
    return SPECIES_DATA[index];
};

const getDateString = (archiveDate?: string) => {
    if (archiveDate) return archiveDate;
    const today = new Date();
    return `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
};

export default function Aquaticdle({ archiveDate }: { archiveDate?: string }) {
    const images = import.meta.glob('/src/assets/images/*.{jpg,jpeg,png,webp,JPG}', { eager: true });

    const targetDateStr = getDateString(archiveDate);
    const targetDateObj = archiveDate ? new Date(archiveDate) : new Date();
    
    const storageKey = archiveDate ? `aquaticdleState_${targetDateStr}` : 'aquaticdleState';

    const loadGameState = () => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.date === targetDateStr) {
                return parsed;
            }
        }
        return null;
    };

    const savedState = loadGameState();

    const [species] = useState(() => getDailySpecies(targetDateObj));

    const [clues] = useState<string[]>(() => {
        if (savedState && savedState.clues) return savedState.clues;
        return shuffle([...species.clues]);
    });

    const [attempts, setAttempts] = useState<number>(savedState ? savedState.attempts : 0);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>(savedState ? savedState.gameStatus : 'playing');
    const [guessedList, setGuessedList] = useState<string[]>(savedState ? savedState.guessedList : []);
    const [inFamily, setInFamily] = useState<boolean[]>(savedState ? (savedState.inFamily || []) : []);
    const [copied, setCopied] = useState<boolean>(false);

    const [timeLeft, setTimeLeft] = useState<string>("");
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        const stateToSave = {
            date: targetDateStr,
            attempts,
            gameStatus,
            guessedList,
            inFamily,
            clues
        };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }, [attempts, gameStatus, guessedList, clues, targetDateStr, storageKey]);

    useEffect(() => {
        if (archiveDate) return; 

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

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [archiveDate]);

    const getImage = (imageName: string) => {
        for (const path in images) {
            if (path.includes(`/${imageName}.`)) {
                return (images[path] as { default: string })?.default || (images[path] as string);
            }
        }
        return '';
    };

    const handleGuessSubmit = (input: string, family: string) => {
        const isCorrect = input.toLowerCase() === species.name.toLowerCase();
        const isInFamily = family.toLowerCase() === species.family.toLowerCase();
        const updatedAttempts = attempts + 1;

        setAttempts(updatedAttempts);
        setGuessedList((prev) => [...prev, input]);
        setInFamily((prev) => [...prev, isInFamily]);

        if (isCorrect) {
            setGameStatus('won');
        } else if (updatedAttempts >= MAX_ATTEMPTS) {
            setGameStatus('lost');
        }
    }

    const numCluesToReveal = gameStatus === 'playing' ? attempts + 1 : MAX_ATTEMPTS;
    const revealedClues = clues.slice(0, numCluesToReveal);

    //logic for sharing results
    const handleShare = async() => {
        const score = gameStatus === 'won' ? `${attempts}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
        const emojiGrid = inFamily
        .map((isFamilyMatch, index) => {
            if (gameStatus === 'won' && index === attempts - 1) {
                return '🟩';
            }
            return isFamilyMatch ? '🟨' : '🟥';
        })
        .join(' ');

        const shareText = `Aquaticdle ${targetDateStr}\nScore: ${score}\n\n${emojiGrid}`;

        //trying mobile share first, going back to clipboard if fails
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Aquaticdle',
                    text: shareText,
                });
                return;
            } catch (err) {
            }
        }

        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(shareText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500); 
            } catch (err) {
                console.error('Failed to copy share text: ', err);
            }
        }
    };

    return (
        <>
            <Link to="/archive" style={{ 
                position: 'fixed', 
                top: '16px', 
                left: '16px', 
                textDecoration: 'none', 
                color: '#08022e', 
                backgroundColor: '#effcff',
                padding: '10px 15px',
                borderRadius: '8px',
                border: '2px solid #08022e',
                fontWeight: 'bold',
                fontSize: '14px',
                zIndex: 9997,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                ☰ Archive
            </Link>

            <div className="game-container" style={{ 
                position: 'relative',
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
                
                <h1 style={{ color: '#1a1a1a', marginTop: '10px' }}>Aquaticdle</h1>
                
                {archiveDate && (
                    <h4 style={{ color: '#5D8896', margin: '0 0 10px 0' }}>
                        Archive Game: {targetDateObj.toLocaleDateString(undefined, { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })}
                    </h4>
                )}

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
                                    bgColor = 'rgba(0, 255, 0, 0.2)';
                                }
                                else if (inFamily[index]) {
                                    bgColor = 'rgba(255, 250, 160, 0.9)';
                                }
                                else {
                                    bgColor = 'rgba(255, 0, 0, 0.15)';
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

                        <div style={{ margin: '20px 0' }}>
                        <button
                            onClick={handleShare}
                            style={{
                                backgroundColor: copied ? 'rgba(0, 255, 0, 0.2)' : 'rgba(50, 107, 198, 0.9)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
                            }}
                        >
                            {copied ? 'Copied to Clipboard' : 'Share Results'}
                        </button>
                    </div>
                        
                        <div style={{ 
                            marginTop:  '25px', 
                            marginBottom: '25px',
                            padding: '15px', 
                            backgroundColor: !archiveDate ? '#f8f9fa' : '#ffffff', 
                            borderRadius: '8px', 
                            border: !archiveDate ?'1px solid #e0e0e0' : '',
                            display: 'inline-block',
                            minWidth: '200px'
                            }}>
                            
                            {!archiveDate && (
                                <>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Next Species In
                                    </p>
                                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', fontVariantNumeric: 'tabular-nums' }}>
                                        {timeLeft}
                                    </p>
                                </>
                            )}

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
        </>
    );
}