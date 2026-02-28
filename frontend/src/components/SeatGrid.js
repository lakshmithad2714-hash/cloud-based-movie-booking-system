import React from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = [1, 2, 3, 4, 5, 6];

const SeatGrid = ({ selectedSeats, bookedSeats, onToggle }) => (
    <>
        <div className="screen-indicator">
            <div className="screen-bar"></div>
            <div className="screen-label">Screen</div>
        </div>

        <div className="seat-grid">
            {ROWS.map((row) => (
                <div key={row} className="seat-row">
                    <span className="seat-row-label">{row}</span>
                    {COLS.map((col) => {
                        const seatId = `${row}${col}`;
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                            <div
                                key={seatId}
                                className={`seat ${isBooked ? 'seat-booked' : ''} ${isSelected ? 'seat-selected' : ''}`}
                                onClick={() => !isBooked && onToggle(seatId)}
                                title={isBooked ? 'Booked' : seatId}
                            >
                                {col}
                            </div>
                        );
                    })}
                    <span className="seat-row-label">{row}</span>
                </div>
            ))}
        </div>

        <div className="seat-legend">
            <div className="seat-legend-item"><div className="legend-box available"></div><span>Available</span></div>
            <div className="seat-legend-item"><div className="legend-box selected"></div><span>Selected</span></div>
            <div className="seat-legend-item"><div className="legend-box booked"></div><span>Booked</span></div>
        </div>
    </>
);

export default SeatGrid;
