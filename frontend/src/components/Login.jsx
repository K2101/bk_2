import { Navigate } from 'react-router-dom';
import '../styles/Login.css'
import { useState } from 'react';
import axios from 'axios';

const Login = ({ user, setUser }) => {
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('123456');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false)


  if (user.login) {
    return <Navigate to="/book" replace />
  }


  const loginSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return;

    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8080/user/login', {
        email, password
      });

      if (res?.data?.message) {
        setLoading(false)
        setUser((prevUser) => ({ ...prevUser, login: true, jwt: res.data.message }));
        localStorage.setItem('user', JSON.stringify({ login: true, jwt: res.data.message }));
        return <Navigate to="/book" replace />
      }
    } catch (err) {
      console.log('err', err)
      setLoading(false)
      setErr(true)
    }

  }


  return (<div className='login'>
    <form >

      <h2>Login</h2>
      <p style={{ marginTop: '20px' }}>Email</p>
      <input style={{
        width: '300px',
        padding: '0.3rem',
        fontSize: '1rem',
        lineHeight: '1.5',
        borderRadius: '5px',
        backgroundColor: '#fff',
        borderWidth: '1px',
        borderColor: 'green',
        color: '#1a202c',
        appearance: 'none',
        marginTop: '5px',
      }}
        placeholder='Example@gmail.com'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />


      <p style={{ marginTop: '20px' }}>Password</p>
      <input style={{
        width: '300px',
        padding: '0.3rem',
        fontSize: '1rem',
        lineHeight: '1.5',
        borderRadius: '5px',
        backgroundColor: '#fff',
        borderWidth: '1px',
        borderColor: 'green',
        color: '#1a202c',
        appearance: 'none',
        marginTop: '5px',
      }}
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        style={{
          display:
            'block', marginTop: '40px', width: '100%',
          padding: '10px',
          borderRadius: '5px',
          color: 'white',
          backgroundColor: 'black',
          cursor: `${!email || !password ? 'not-allowed' : 'pointer'}`,
          border: 'none',
          opacity: `${!email || !password ? '0.5' : ''}`,
          fontSize: '20px'
        }}
        onClick={(e) => loginSubmit(e)}
      >{loading ? 'Loading...' : 'Login'}</button>

      <div style={{ marginTop: '20px', textAlign: 'center', color: 'red', fontSize: '25px' }}>

        {err && 'invalid credentials'}
      </div>
    </form>

  </div >
  )
}

export default Login;
