import Header from "../../components/Header/Header";
import styles from '../Stats/Stats.module.css';

function Stats(){

    return(
        <>
            <Header />
            <table>
                <th>SOS</th>
                <th>NET</th>
                <th>Offensive Rating</th>
                <th>Defensive Rating</th>
                <th>EFG</th>
                <th>TS%</th>
                <th>ORB%</th>
                <th>DRB%</th>
                <th>TRB%</th>
                <th>AST%</th>
                <th>STL%</th>
                <th>BLK%</th>
                <th>PACE</th>
                <th>3PAR</th>
                <th>FTAR</th>
                <th>PPG</th>
                <th>FG%</th>
                <th>2FG%</th>
                <th>3FG%</th>
                <th>FT%</th>
                <th>APG</th>
                <th>AST-TOV</th>
                <th>PPG Allowed</th>
                <th>FG% Allowed</th>
                <th>2 point FG% Allowed</th>
                <th>3 point FG% Allowed</th>
                <th>SPG</th>
                <th>BPG</th>
                <th>Fouls</th>
                <th>ADJOE</th>
                <th>ADJDE</th>
                <th>BARTHAG</th>
                <th>WAB</th>
                <th>CONF</th>
            </table>




        </>
    )

}

export default Stats;