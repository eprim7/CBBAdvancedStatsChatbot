import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Chat from './pages/Chat/Chat';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import About from './pages/About/About';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home  />}/>
        <Route path='/chat' element={<Chat />} />
        <Route path='/stats' element={<Stats />} />
        <Route path='/about' element={<About />} />

      </Routes>
    </Router>

    
  );
}

export default App;
