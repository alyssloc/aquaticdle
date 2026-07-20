import { useState, useEffect, type ReactNode } from 'react';

interface InfoPopupProps {
    trigger?: boolean;
    setTrigger?: (value: boolean) => void; 
    children?: ReactNode;
}

function InfoPopup(props: InfoPopupProps) {
    const [popup, setPopup] = useState(false);

    //check if the user has visited the site before, and if not, set 1 second timer to display popuo
    useEffect(() => {
        const hasVisited = localStorage.getItem('notFirstTimeCheckIn');

        if (!hasVisited) {
            const timer = setTimeout(() => {
                setPopup(true);
                localStorage.setItem('notFirstTimeCheckIn', 'true');
            }, 1000);


            return () => clearTimeout(timer);
        }
    }, []);

    const showPopup  = props.trigger || popup;

    const handleClose = () => {
        setPopup(false);
        if (props.setTrigger) {
            props.setTrigger(false);
        }
    };

    const handleOpen = () => {
        setPopup(true);
        if (props.setTrigger) {
            props.setTrigger(true);
        }
    };

    return (
        <>
            <button 
                onClick={handleOpen}
                style={{
                    position: 'fixed',
                    top: '16px',
                    right: '16px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#effcff',
                    color: '#08022e',
                    border: '2px solid #08022e',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    zIndex: 9998,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                aria-label="How to play"
            >
                i
            </button>

            {showPopup && (
                <div className='info-popup' style={{ 
                    position: 'fixed',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', 
                    padding: '30px', 
                    width: '90%', 
                    maxWidth: '600px', 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#d9eef2', 
                    fontSize: '20px',
                    borderRadius: '24px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)', 
                    color: '#08022e',
                    zIndex: 9999
                }}>
                    <h1 style={{ color: '#1a1a1a' }}>How to Play</h1>
                    <h3 style={{ color: '#1a1a1a', textAlign: 'center' }}>Guess the marine, aquatic, or semi-aquatic mammal in 6 tries</h3>
                    <div style={{ color: '#1a1a1a', lineHeight: '1.5', textAlign: 'left' }}>
                        <ul>
                        <li> Animals in this game include seals, sea lions, sea otters, whales, dolphins, and more </li>
                        <li> Any valid guess will appear in the search bar as you type in the animal's name </li>
                        <li> Clues are related to the animal's appearance, behaviors, conservation status, range, and culture </li>
                        <li> Species refresh at midnight UTC </li>
                        </ul>
                    </div>
                    
                    <div className='popup-inner' style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        width: '100%',
                        marginTop: '16px'
                    }}>
                        { props.children }
                    
                        <button className='close-button' onClick={handleClose} style={{
                            padding: '8px 24px',
                            marginTop: '16px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            border: '1px solid #1a1a1a',
                            backgroundColor: '#fff',
                            color: '#1a1a1a',
                            fontWeight: 'bold'
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default InfoPopup;