import Header from "../../components/Header/Header";
import styles from '../Home/Home.module.css';

function Home(){
    return(
        <>
            <Header />
            <h1 className={styles.title}>Home of all things college basketball stats</h1>
            <div className={styles.imageContainer}>
                <img src="/assets/Home.png" alt="home page" />
            </div>
            <div className={styles.footerContainer}>
                <div className={styles.blurbs}>
                    We offer a chatbot to efficiently access all of your favorite team's stats. Our chatbot also has functionality 
                    to sort teams based off the stats you input
                </div>
                <div className={styles.blurbs}>
                    Our stats page is a more traditional stats page, that allows you to easily visualize every division one
                    college basketball teams stats, and how they rank in terms of the median
                </div>
                <div className={styles.blurbs}>
                    Our last page is an about page, about the creator of this website, and how all of the data was obtained
                </div>
            </div>
        </>
    )
}

export default Home;