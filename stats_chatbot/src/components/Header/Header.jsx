import styles from '../Header/Header.module.css';
import { Link } from 'react-router-dom';
function Header(){
    return(
        <>
            <div className={styles.container}>
                <h1>
                    <Link className={styles.link} to='/'>Home</Link>
                </h1>
                <h1>
                    <Link className={styles.link} to='/Chat'>ChatBot</Link>
                </h1>
                <h1>
                    <Link className={styles.link}  to='/Stats'>Stats</Link>
                </h1>
            </div>
            <hr />
        </>
    )
}

export default Header