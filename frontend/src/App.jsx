import Login from "./pages/login";
import Game from "./pages/game";
//import Date from "./pages/date-select";
import Statistics from "./pages/statistics";
//import Settings from "./pages/settings";

import { Routes, Route } from "react-router-dom";

function App() {



    return (
        <Routes>

            {
            
            //<Route path="/settings" element={<Settings />}/>
                        
            //<Route path="/date-select" element={<Date />}/>
            }

            <Route path="/" element={<Game />} />

            <Route path="/login" element={<Login />}/>

            <Route path="/statistics" element={<Statistics />}/>   

                

        </Routes>
        
    )
}

export default App;
