// Displays ONEWORDSEARCH UNLIMITED and the puzzle number
import "../styles/Header.css"

function Header({ puzzleNumber }){
    return (
        <header>
            <h1>ONE WORD SEARCH UNLIMITED</h1>
            <p>Daily Search #{puzzleNumber}</p>
        </header>
    );
}

export default Header;