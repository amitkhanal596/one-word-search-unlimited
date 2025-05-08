function Tile({ letter, onClick, isSelected, coordinate }) {
    return (
        <div 
            className={`tile ${isSelected ? "selected" : ""} ${coordinate}`} 
            onClick={onClick}
        >
            {letter}
        </div>
    );
}

export default Tile;
