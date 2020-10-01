import React, {useState,useEffect} from 'react';
import './App.css';
import alanBtn from '@alan-ai/alan-sdk-web'
import Cards from './components/Cards'
import Modal from './components/Modal'
import useStyles from './styles.js'
import wordsToNumbers from 'words-to-numbers'
import { Typography } from '@material-ui/core';
import Navbar from './Navbar'

const alanKey = '630becba69be9e18c1a8d7ed324aaba52e956eca572e1d8b807a3e2338fdd0dc/stage'

const App = () => {

  const classes = useStyles();

  const [newsArticles, setNewsArticles ] = useState([])
  const [activeArticle, setActiveArticle] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({command, articles, number}) => {
        if(command === 'newHeadlines'){
          setNewsArticles(articles);
          setActiveArticle(-1)
        } else if (command === 'instructions'){
          setIsOpen(true)
        }else if(command === 'highlight'){
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if(command === 'open'){
          const parsedNumber = number.length > 2 ? wordsToNumbers(number, {fuzzy: true}) : number;

          const article = articles[parsedNumber - 1];

          if(parsedNumber > 20) {
            alanBtn().playText('Please try again.')
          } else if(article){
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...')
          } else {
            alanBtn().playText('Please try again..')
          }
        }
      }
    })
  },[])

  return (
    <div>
      <Navbar/>
    <div className={classes.logoContainer}>
      {newsArticles.length ? (
        <div className={classes.infoContainer}>
          <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
          <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
        </div>
      ) : null}
      <img src="https://alan.app/voice/images/previews/preview.jpg" className={classes.alanLogo} alt="logo" />
    </div>
    <Cards articles={newsArticles} activeArticle={activeArticle} />
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
  </div>
  );
}

export default App;
