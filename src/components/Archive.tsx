import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Archive() {
    // archive starts on 08/06/2026
    const START_YEAR = 2026;
    const START_MONTH = 7; 
    const START_DAY = 6;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date();
    const currentYear = today.getUTCFullYear();
    const currentMonth = today.getUTCMonth();

    const [viewDate, setViewDate] = useState(() => new Date(Date.UTC(currentYear, currentMonth, 1)));

    const viewYear = viewDate.getUTCFullYear();
    const viewMonth = viewDate.getUTCMonth();

    const handlePrevMonth = () => {
        setViewDate(new Date(Date.UTC(viewYear, viewMonth - 1, 1)));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(Date.UTC(viewYear, viewMonth + 1, 1)));
    };


    const canGoPrev = viewYear > START_YEAR || (viewYear === START_YEAR && viewMonth > START_MONTH);
    const canGoNext = viewYear < currentYear || (viewYear === currentYear && viewMonth < currentMonth);

    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
    const firstDayOfWeek = new Date(Date.UTC(viewYear, viewMonth, 1)).getUTCDay(); 

    const calendarCells = [];

    //empty spots for offset
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarCells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cellDateStr = `${viewYear}-${viewMonth + 1}-${day}`;

        //checking date boundaries
        const isBeforeStart = 
            viewYear < START_YEAR || 
            (viewYear === START_YEAR && viewMonth < START_MONTH) || 
            (viewYear === START_YEAR && viewMonth === START_MONTH && day < START_DAY);

        const isAfterToday = 
            viewYear > currentYear || 
            (viewYear === currentYear && viewMonth > currentMonth) || 
            (viewYear === currentYear && viewMonth === currentMonth && day >= today.getUTCDate());

        const isPlayable = !isBeforeStart && !isAfterToday;

        if (isPlayable) {
            calendarCells.push(
                <Link
                    key={cellDateStr}
                    to={`/archive/${cellDateStr}`}
                    style={{
                        padding: '12px 0',
                        backgroundColor: '#5D8896',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px'
                    }}
                >
                    {day}
                </Link>
            );
        } else {
            calendarCells.push(
                <div
                    key={`disabled-${day}`}
                    style={{
                        padding: '12px 0',
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        color: '#bbb',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        cursor: 'not-allowed'
                    }}
                >
                    {day}
                </div>
            );
        }
    }

    return (
        <>
            <Link to="/" style={{ 
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
                ← Back to Daily
            </Link>

            <div style={{
                padding: '25px',
                maxWidth: '480px',
                margin: '40px auto',
                marginTop: '75px',
                backgroundColor: '#eef8fe',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                color: '#08022e',
                textAlign: 'center'
            }}>
                <h1 style={{ color: '#1a1a1a', marginTop: '5px', marginBottom: '5px' }}>Game Archive</h1>
                <p style={{ color: '#555', marginTop: 0, marginBottom: '20px' }}>Select a date to play past games</p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    padding: '0 5px'
                }}>
                    <button 
                        onClick={handlePrevMonth}
                        disabled={!canGoPrev}
                        style={{
                            padding: '8px 14px',
                            backgroundColor: canGoPrev ? '#5D8896' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: canGoPrev ? 'pointer' : 'not-allowed',
                            fontSize: '14px'
                        }}
                    >
                        ← Prev
                    </button>

                    <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: '18px' }}>
                        {monthNames[viewMonth]} {viewYear}
                    </h2>

                    <button 
                        onClick={handleNextMonth}
                        disabled={!canGoNext}
                        style={{
                            padding: '8px 14px',
                            backgroundColor: canGoNext ? '#5D8896' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: canGoNext ? 'pointer' : 'not-allowed',
                            fontSize: '14px'
                        }}
                    >
                        Next →
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '6px',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    marginBottom: '10px',
                    fontSize: '13px'
                }}>
                    {weekdays.map((wk) => (
                        <div key={wk}>{wk}</div>
                    ))}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '6px'
                }}>
                    {calendarCells}
                </div>
            </div>
        </>
    );
}