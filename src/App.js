import React, { useState } from 'react';
import './App.css';
import { Fade } from 'react-awesome-reveal';
import logo from './dalhalla.png';

function App() {
  const [data, setData] = useState(null);
  const [expandedIndex] = useState(null);
  const [inputData, setInputData] = useState('HHV0ZC');
  const [loading, setLoading] = useState(false); // state variable for loading status
  const [apiKey, setApiKey] = useState('HHV0ZC');

  console.log(loading);
  const handleInput = (e) => {
    console.log(e.target.value);
    const newInput = e.target.value.toUpperCase();
    setInputData(newInput);
    setApiKey(newInput);
    console.log('detta är ' + apiKey);
  };

  const saveInput = () => {
    localStorage.clear();
    setLoading(true);
    const url = `https://proxyserversalestracker.onrender.com/https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey.trim()}`;
    console.log(url);

    fetch(
      `https://proxyserversalestracker.onrender.com/https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey.trim()}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        // Spara data i local storage -
        localStorage.setItem('cachedData', JSON.stringify(data));
        console.log(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
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
        <h3>Salestrackernyckel:</h3>
        <input
          type='text'
          value={inputData}
          onChange={handleInput}
          placeholder='T ex 12345'
        />
        <button onClick={saveInput}>Hämta</button>
        {loading ? <p className='loading'>Laddar data. Detta kan ta lite tid om det är första gången du hämtar data på denna nyckeln.</p> : <p></p>}
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
          {data.map((item, index) => (
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
                  <p><b className='small'>Sålda biljetter inkl. fribiljetter:</b> {item.sales.soldQtyNet + item.sales.freeTktQtyNet}</p>
                  <img src={item.img.thumb} alt={item.name} />
                  <div className='scannedTickets'></div>
                </div>            
              </div>
            </Fade>
          ))}
        </div>
        <div className='keyInput'>
          <h3>Salestrackernyckel:</h3>
          <input
            type='text'
            value={inputData}
            onChange={handleInput}
            placeholder='T ex 12345'
          />
          <button onClick={saveInput}>Hämta</button>
        </div>
      </header>
    </div>
  );
}

export default App;
