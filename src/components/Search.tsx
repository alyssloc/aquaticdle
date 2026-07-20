import { useState, type ChangeEvent, useEffect, useRef } from "react"
import { SPECIES_DATA } from "../animals/species.ts"
import "../css/Search.css"

interface SearchProps {
    onSelect: (speciesName: string) => void;
    guessedList: string[];
}

const Search = ({ onSelect, guessedList }: SearchProps) => {
    const [search, setSearch] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currIndex, setCurrIndex] = useState<number>(-1);
    const [renderUpwards, setRenderUpwards] = useState<boolean>(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    //filter by user search and also do not include already guessed options
    const filteredSpecies = SPECIES_DATA.filter((species) =>
        species.name.toLowerCase().includes(search.toLowerCase()) &&
        !guessedList.some((guessedName: string) => guessedName.toLowerCase() === species.name.toLowerCase())
    );

    //if user hasn'ty types anything yet, display nothing
    const matchingSpecies = search.trim() === "" ? [] : filteredSpecies;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        //preventing invalid submissions (doesn't match one of animals in list)
        if (e.key === "Enter") {
            e.preventDefault();
        }

        if (!isOpen || matchingSpecies.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setCurrIndex((prevIndex) => 
                prevIndex < matchingSpecies.length - 1 ? prevIndex + 1 : 0
            )
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setCurrIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : matchingSpecies.length - 1
            )
        } 
        if (e.key === "Enter") {
            e.preventDefault();
            let selectedName = "";
            if (currIndex >= 0 && currIndex < matchingSpecies.length && isOpen) {
                selectedName = matchingSpecies[currIndex].name;
                //setSearch(matchingSpecies[currIndex].name);
                setIsOpen(false);
                setSearch("");
                setCurrIndex(-1);
                onSelect(selectedName);
            }
        }
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    }
    
    //checking if search menu goes off the buttom of the screen
    useEffect(() => {
        if (isOpen && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            // if there's less than 260px below the input, flip the menu upwards
            if (spaceBelow < 260) {
                setRenderUpwards(true);
            } else {
                setRenderUpwards(false);
            }
        }
    }, [isOpen, search]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [wrapperRef]);
        
    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '350px' }}> 
            <input 
                type="text"
                placeholder="Search..."
                value={search}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onFocus={() => setIsOpen(true)}
                style={{
                    width: '100%',
                    padding: '14px 20px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '24px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    overflowY: 'auto',
                    maxHeight: '240px'
                }}
            />
            {isOpen && matchingSpecies.length > 0 && (
                <ul className="dropdown-list" style={{ 
                    position: 'absolute', 
                    ...(renderUpwards ? { bottom: '100%', marginBottom: '8px' } : { top: '100%', marginTop: '8px' }),
                    left: 0, 
                    right: 0,
                    backgroundColor: '#5D8896',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 0', 
                    margin: '8px 0 0 0', 
                    listStyle: 'none', 
                    zIndex: 10,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}>
                    {matchingSpecies.map((item, index) => (
                        <li 
                            key={index}
                            onClick={() => {
                                setSearch("");
                                setIsOpen(false);
                                onSelect(item.name);
                            }}
                            style={{ 
                                backgroundColor: currIndex === index ? "rgba(255,255,255,0.3)" : "transparent",
                                padding: "10px 20px",
                                cursor: "pointer",
                                fontWeight: currIndex === index ? 'bold' : 'normal',
                                transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={() => setCurrIndex(index)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;