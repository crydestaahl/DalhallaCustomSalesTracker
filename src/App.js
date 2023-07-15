import React, { useEffect, useState } from 'react';
import './App.css';
import { Fade } from 'react-awesome-reveal';
import logo from './dalhalla.png';

function App() {
  const [data, setData] = useState(null);
  const [expandedIndex] = useState(null);
  const [loading, setLoading] = useState(false); // state variable for loading status
  const [apiKey, setApiKey] = useState('HHV0ZC');
  const [lastWorkingKey, setLastWorkingKey] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [notToggled, setNotToggled] = useState(false); // state variable

  useEffect(() => {
    const fetchData = () => {
      localStorage.clear();
      setLoading(true);
      setLastWorkingKey(apiKey);
      fetch(
        `https://proxyserversalestracker.onrender.com/https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey.trim()}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
          // Spara data i local storage -
          if (data[0].ven.vrc === 'AMEP2ZTG94GUJNV') {
            localStorage.setItem('cachedData', JSON.stringify(data));           
            setLastWorkingKey(apiKey);
            setLoading(false);
          }
        })
        .catch((error) => console.error(error));
    };
    fetchData();
  }, [apiKey]);

  const toggleInfoFunction = (index) => {
    // function to toggle the active index
    notToggled ? setNotToggled(false) : setNotToggled(true);
    if (activeIndex === index) {
      // if the current index is already active, set it to null
      setActiveIndex(null);
    } else {
      // otherwise, set it to the current index
      setActiveIndex(index);
    }
  };

  function formatTime(timeStr) {
    const date = new Date(timeStr);
    const isoString = date.toISOString();
    const formattedDate = isoString.substring(0, 10);
    const formattedTime = isoString.substring(11, 16);
    return formattedDate + ' ' + formattedTime;
  }

  const refresh = () => {
    setApiKey(lastWorkingKey);
  };

  if (!data) {
    return (
      <div className='keyInput'>
        <img src={logo} alt='Dalhalla' className='logo' />
        {loading ? (
          <div>
            <p className='loading'>Laddar data</p>
            <p className='loadingText'>
              Detta kan ta lite tid om det är första gången du hämtar data på
              denna nyckeln.
            </p>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className='keyInput'>
        <img src={logo} alt='Dalhalla' className='logo' />
        <h3>Salestrackernyckel:</h3>
      </div>
    );
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='eventFeed'>
          <img src={logo} alt='Dalhalla' className='logo' />
          {loading ? <p className='loading'>Laddar data</p> : <p></p>}
          {!loading && data[0]?.ven?.vrc === 'AMEP2ZTG94GUJNV' ? (
            data.map((item, index) => (
              <Fade>
                <div
                  className={`eventCard ${
                    index === expandedIndex ? 'transition' : ''
                  }`}
                  key={item.erc}
                  loading='lazy'
                >
                  <div className='eventInfo' key={item.erc}>
                    <h3 className='eventName'>{item.name}</h3>
                    <h4>Start: {formatTime(item.startLocal)}</h4>
                    <p>
                      <b className='small'>
                        Sålda biljetter inkl. fribiljetter:
                      </b>{' '}
                      {item.sales.soldQtyNet + item.sales.freeTktQtyNet}
                    </p>
                    <img src={item.img.thumb} alt={item.name} />
                    <button onClick={() => toggleInfoFunction(item.erc)}>
                      {notToggled ? 'Mindre info' : 'Mer info'}
                    </button>
                    <div
                      className='ticketInfo'
                      style={{
                        display: activeIndex === item.erc ? 'block' : 'none',
                      }}
                    >
                      <h4>Bussbiljetter</h4>
                      <br></br>

                      {item.gfs
                        .filter(
                          (ticket) =>
                            ((ticket.type === 5 || ticket.type === 0) && // Group the ticket type conditions
                              ticket.name !== 'VIP Acess Bakre Loge' &&
                              ticket.name !== 'VIP Access - Tillval' &&
                              ticket.name !== '3-Rättersmeny - Tillval' &&
                              ticket.name !== 'Avbeställningsskydd' &&
                              ticket.name !== '3-Rätters meny - Konsertmiddag' &&
                              ticket.name !== 'VIP Acess Främre Loge' &&
                              ticket.name !== 'VIP Access') ||
                            (ticket.name === 'Restaurangbuss - Tur & Retur' || // Group the ticket name conditions
                              ticket.name === 'Restaurangbuss - Hemresa')
                        )
                        .map((ticket) => (
                          <div className='ticketInfo'>
                            <h4>
                              <b>{ticket.name + ':'}</b>
                            </h4>
                            <h4>
                              Sålt antal:{' '}
                              <b>{ticket.soldQtyNet + ticket.freeTktQtyNet} </b>
                            </h4>
                            <br></br>
                          </div>
                        ))}
                    </div>

                    {notToggled && (
                      <button
                        onClick={() => toggleInfoFunction(item.erc)}
                      >{notToggled ? 'Mindre info' : 'Mer info'}</button>
                    )}
                  </div>
                </div>
              </Fade>
            ))
          ) : (
            <p className='error'>Nyckeln tillhör inte Dalhalla</p>
          )}
          <button className='refresh' onClick={refresh}>
            Ladda om sidan
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
