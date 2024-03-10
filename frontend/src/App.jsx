import { useEffect, useState } from 'react';
import './App.css'
import { Route, Routes, BrowserRouter as Router, } from 'react-router-dom';
import Login from './components/Login';
import Booking from './components/Booking';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, setUser] = useState({ login: false, jwt: '' })

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser || savedUser?.login) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <Routes >
        <Route path="/book" element={<PrivateRoute user={user}> <Booking user={user} /> </PrivateRoute>} />
        <Route path="/" element={<Login user={user} setUser={setUser} />} />
        {/* <Route path="/*" element={<PrivateRoute user={user}> <Booking user={user} /> </PrivateRoute>} /> */}
      </Routes >
    </Router>
  )
}

export default App;