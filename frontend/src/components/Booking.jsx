import { useEffect, useState } from "react";
import Modal from './Modal';
import axios from "axios";

const monthMap = {
  0: { name: "January", daysInThisMonth: 31 },
  1: { name: "February", daysInThisMonth: 28 },
  2: { name: "March", daysInThisMonth: 31 },
  3: { name: "April", daysInThisMonth: 30 },
  4: { name: "May", daysInThisMonth: 31 },
  5: { name: "June", daysInThisMonth: 30 },
  6: { name: "July", daysInThisMonth: 31 },
  7: { name: "August", daysInThisMonth: 31 },
  8: { name: "September", daysInThisMonth: 30 },
  9: { name: "October", daysInThisMonth: 31 },
  10: { name: "November", daysInThisMonth: 30 },
  11: { name: "December", daysInThisMonth: 31 }
};

const Booking = ({ user }) => {
  const thisDate = new Date();
  const date = thisDate.getDate();
  const month = thisDate.getMonth();
  const year = thisDate.getFullYear();

  const [selectMonth, setSelectMonth] = useState(month);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getMonth = monthMap[selectMonth];

  const [bookList, setBookList] = useState([])



  const bookedMap = {};

  useEffect(() => {
    const f = async () => {
      const res = await axios.get('http://localhost:8080/book', {
        headers: {
          Authorization: `Bearer ${user.jwt}`
        }
      });
      setBookList(res.data)
    }
    f();
  }, [isModalOpen])


  const thisMonth = bookList.filter((book) => book.startMonth === selectMonth || book.endMonth === selectMonth);

  for (let b of thisMonth) {

    if (b.startDate <= b.endDate) {
      for (let i = b.startDate; i <= b.endDate; i++) {
        bookedMap[selectMonth] = bookedMap[selectMonth] || {};
        bookedMap[selectMonth][i] = { bookData: b };
      }
    } else {
      if (b.startMonth !== b.endMonth && b.startDate > b.endDate) {
        const monthDate = monthMap[selectMonth].daysInThisMonth;
        for (let i = b.startDate; i <= monthDate; i++) {
          if (b.endMonth === selectMonth) {
            break;
          }
          bookedMap[selectMonth] = bookedMap[selectMonth] || {};
          bookedMap[selectMonth][i] = { bookData: b };
        }
      }
    }

    if (b.startDate > b.endDate) {
      for (let i = 1; i <= b.endDate; i++) {
        if (selectMonth === b.endMonth) {
          bookedMap[selectMonth] = bookedMap[selectMonth] || {};
          bookedMap[selectMonth][i] = { bookData: b };
        }

      }
    }
  }


  const renderDays = () => {
    const days = [];

    let datePlusCheckLeapYear = getMonth.daysInThisMonth;
    if (date === 29 && selectMonth === 1) {
      datePlusCheckLeapYear = 29;
    }


    for (let i = 0; i < datePlusCheckLeapYear; i++) {
      const dateNum = i + 1;

      const selectBook = bookedMap[selectMonth]?.[dateNum];


      days.push(<div
        className={`day_item ${dateNum < date && selectMonth <= month ? ` disabled` : ''} 
        ${selectBook ? ` booked` : ''}`}
        onClick={() => onClickBook(dateNum, selectBook)} key={i}

      >{selectBook ? 'Booked' : dateNum}</div>);


    }


    return (
      <>
        <div style={{ margin: '40px', textAlign: 'center', fontSize: '40px', fontWeight: 'bolder' }}>
          {selectMonth > month && <span style={{ cursor: 'pointer', margin: '50px' }}
            onClick={prevMonth}
          >{'<'}</span>}

          {monthMap[selectMonth].name}, {year}

          {selectMonth !== 11 && <span
            style={{ cursor: 'pointer', margin: '50px' }}
            onClick={nextMonth}
          >{'>'}</span>}
        </div>
        <div className='date_map'>
          {days}
        </div>
      </>
    )
  }

  const prevMonth = () => {
    if (month === selectMonth) return;
    setSelectMonth((prev) => prev -= 1)
  }

  const nextMonth = () => {
    if (selectMonth === 11) return;
    setSelectMonth((prev) => prev += 1)
  }


  const [bookPass, setBookPass] = useState({})
  const [chooseDate, setChooseDate] = useState(0)
  const onClickBook = (day, selectBook) => {
    if (day < date && selectMonth <= month) return;
    setChooseDate(day)



    setBookPass(selectBook?.bookData);
    setIsModalOpen(true)
  }



  const close = () => {
    setIsModalOpen(false)
  }


  return (
    <div className='app'>

      {renderDays()}

      {isModalOpen && <Modal bookPass={bookPass} close={close} jwt={user.jwt}
        chooseDate={chooseDate} chooseMonth={selectMonth} chooseYear={year} />}
    </div>
  )
}

export default Booking;


