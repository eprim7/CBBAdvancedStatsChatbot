import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Chat from './pages/Chat/Chat';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home  />}/>
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </Router>

    
  );
}

export default App;
