import { useState } from 'react';
import '../styles/Modal.css'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from "react-datepicker";
import axios from 'axios';

const Modal = ({ bookPass, close, jwt, chooseDate, chooseMonth, chooseYear }) => {

  const [start, setStart] = useState(new Date(chooseYear, chooseMonth, chooseDate))
  const [end, setEnd] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState({ isErr: false, message: '' })
  const renderBooked = () => {
    return <div style={{ marginTop: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Booked Info</h3>
      <p style={{ marginTop: '20px' }}>{`Booked ID: ${bookPass.id}`}</p>
      <p style={{ marginTop: '10px', color: 'red' }}>{`start: ${bookPass.startDate}/${bookPass.startMonth + 1}/${bookPass.startYear} - 
      ${bookPass.endDate}/${bookPass.endMonth + 1}/${bookPass.endYear}.`}</p>

      <p style={{ marginTop: '10px' }}>{`Name: ${bookPass.name}`}</p>
      <p style={{ marginTop: '10px' }}>{`Email: ${bookPass.email}`}</p>
      <p style={{ marginTop: '10px' }}>{`Phone: ${bookPass.phone}`}</p>
      <p style={{ marginTop: '10px' }}>{`Booked Date: ${bookPass.createdAt}`}</p>
    </div>
  }


  const booking = () => {
    return <div style={{ marginTop: '20px' }} >
      <p style={{ marginTop: '10px' }}>Start Date</p>
      <DatePicker selected={start} disabled
        dateFormat="dd/MM/yyyy"
      />

      <p style={{ marginTop: '20px' }}>End Date</p>
      <DatePicker selected={end} onChange={(date) => setEnd(date)}
        dateFormat="dd/MM/yyyy"
        minDate={new Date(chooseYear, chooseMonth, chooseDate)}
        autoComplete='none'
      />

      <p style={{ marginTop: '20px' }}>Email</p>
      <input placeholder='Example@gmail.com' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />

      <p style={{ marginTop: '20px' }}>Name</p>
      <input placeholder='Bob' type='text' value={name} onChange={(e) => setName(e.target.value)} />

      <p style={{ marginTop: '20px' }}>Phone</p>
      <input placeholder='0812345678' type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />


      <button style={{
        display: 'block', marginTop: '20px', width: '50%', borderRadius: '5px',
        backgroundColor: 'black',
        color: 'white',
        padding: '8px',
        border: 'none',
        fontSize: '20px',
        cursor: `${!end || !email || !name || !phone ? 'not-allowed' : 'pointer'}`,
        opacity: `${!end || !email || !name || !phone ||
          phone.length !== 10 || !parseInt(phone) || !isValidEmail(email) ? '0.5' : ''}`,
      }}
        onClick={submit}
      >Book!</button>

      <div style={{ color: 'red', fontSize: '15px' }}>

        {err.isErr && err.message}
      </div>
    </div>
  }




  const isValidEmail = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;
    if (emailRegex.test(email)) {
      return true
    }
    return false
  }



  const submit = async () => {
    if (!end || !email || !name || !phone ||
      phone.length !== 10 || !parseInt(phone) || !isValidEmail(email)) return;


    try {

      const res = await axios.post('http://localhost:8080/book', {
        startDate: start, endDate: end, email, name, phone
      }, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      if (res.data.message === 'the selected date was being booked') {
        throw new Error('the selected date was being booked');
      }
      close()
    } catch (err) {
      setErr({ isErr: true, message: 'the selected date was being booked' })
    }
  }

  return (
    <div className="modal">
      <div className="modal_content">
        <h5 style={{ textAlign: 'center', fontSize: '25px' }}>{bookPass ? "Booked" : "Booking"}</h5>

        <button className="modal_close" onClick={close}>
          X
        </button>



        {bookPass ? renderBooked() : booking()}

      </div>


    </div>
  );
};

export default Modal;
