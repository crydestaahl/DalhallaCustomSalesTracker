import React, { useEffect, useState } from 'react';
import './App.css';
import { Fade } from 'react-awesome-reveal';
import logo from './dalhalla.png';

function App() {
  const [data, setData] = useState(null);
  const [expandedIndex] = useState(null);
  const [inputData, setInputData] = useState('HHV0ZC');
  const [loading, setLoading] = useState(false); // state variable for loading status
  const [apiKey, setApiKey] = useState('HHV0ZC');

  useEffect(() => {
    const fetchData = () => {
      localStorage.clear();
      setLoading(true);

      fetch(
        `https://proxyserversalestracker.onrender.com/https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey.trim()}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
          // Spara data i local storage -
          localStorage.setItem('cachedData', JSON.stringify(data));
          setLoading(false);
        })
        .catch((error) => console.error(error));
    };
    fetchData();
  }, [apiKey]);

  const handleFocus = () => {
    setInputData('');
  };

  const handleInput = (e) => {
    const newInput = e.target.value.toUpperCase();
    setInputData(newInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveInput();
    }
  };

  const refresh = () => {
    window.location.reload();
  };

  const saveInput = () => {
    setData('');

    if (inputData.length === 6) {
    localStorage.clear();
    setLoading(true);
    
    fetch(
      `https://proxyserversalestracker.onrender.com/https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey.trim()}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        // Spara data i local storage -
        localStorage.setItem('cachedData', JSON.stringify(data));
        setApiKey(inputData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      alert('Felaktig nyckel, försök igen.')
      window.location.reload();
    }
  };

  function formatTime(timeStr) {
    const date = new Date(timeStr);
    const isoString = date.toISOString();
    const formattedDate = isoString.substring(0, 10);
    const formattedTime = isoString.substring(11, 16);
    return formattedDate + ' ' + formattedTime;
  }

  if (!data) {
    return (
      <div className='keyInput'>
        <img src={logo} alt='Dalhalla' className='logo' />
        {loading ? (
          <div>
          <p className='loading'>
            Laddar data
          </p>
          <p className='loadingText'>
            Detta kan ta lite tid om det är första gången du hämtar
            data på denna nyckeln.
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
        <input
          type='text'
          value={inputData}
          onChange={handleInput}
          placeholder='T ex 12345'
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
        <button onClick={saveInput}>Hämta</button>
        {!loading ? '' : ''}
      </div>
    );
  }


  return (
    <div className='App'>
      <header className='App-header'>
        <div className='eventFeed'>
          <img src={logo} alt='Dalhalla' className='logo' />
          {loading ? (
            <p className='loading'>
              Laddar data
            </p>
          ) : (
            <p></p>
          )}
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
                    <div className='scannedTickets'></div>
                  </div>
                </div>
              </Fade>
            ))
          ) :   
              <p className='error'>Nyckeln tillhör inte Dalhalla</p> 
          }
          <button className="refresh" onClick={refresh}>Ladda om sidan</button>
        </div>
        
        
        <div className='keyInput'>
          <p className="currentKey">Ladda data från en annan nyckel:</p>
          <input
            type='text'
            value={inputData}
            onChange={handleInput}
            placeholder='T ex 12345'
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
          />
          <p className='currentKey'>Nuvarande nyckel: {apiKey}</p>
          <button onClick={saveInput}>Hämta</button>
        </div>        
      </header>
    </div>
  );
}

export default App;
