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
                      <h3>Bussbiljetter</h3>
                      <br></br>

                      <h3 style={{ borderBottom: '1px solid #333' }}>Restaurangbuss - Hemresa</h3>
                      {item.gfs
                        .filter(
                          (ticket) =>
                              ticket.name === 'BORLÄNGE RESECENTRUM BUSSTERM.' ||
                              ticket.name === 'DALECARLIA' ||
                              ticket.name === 'DJURÅS BUSSTATION, S INDUSTRIV' ||
                              ticket.name === 'FALUN RESECENTRUM' ||
                              ticket.name === 'FALUN SCANDIC LUGNET HPL HÖGSK' ||
                              ticket.name === 'FIRST HOTEL GYLLENE HORNET' ||
                              ticket.name === 'GREEN HOTEL' ||
                              ticket.name === 'GRYCKSBOKROGEN HPL RV69' ||
                              ticket.name === 'GÄVLE RESECENTRUM' ||
                              ticket.name === 'HOFORS BUSSTATION' ||  
                              ticket.name === 'INSJÖN HJULTORGET HPL RV70' ||
                              ticket.name === 'KLOCKARGÅRDEN' ||
                              ticket.name === 'LUDVIKA BUSSTATION' ||
                              ticket.name === 'LEKSAND HOTELL MOSKOGEN' ||
                              ticket.name === 'LEKSAND RESECENTRUM STATIONSG.' ||
                              ticket.name === 'LEKSAND STRAND SILJANSVÄGEN' ||
                              ticket.name === 'MORA RESECENTRUM' || 
                              ticket.name === 'MORA HOTELL HPL MORASTRAND' ||
                              ticket.name === 'MORAPARKEN SIMHALLEN' ||
                              ticket.name === 'ORSA BUSSTATION' ||
                              ticket.name === 'SANDVIKEN RESECENTRUM' ||
                              ticket.name === 'TÄLLBERGSGÅRDEN' ||
                              ticket.name === 'UTBY MAJSTÅNGEN' ||
                              ticket.name === 'VIKARBYN HEMKÖP' ||
                              ticket.name === 'VILLA LÅNGBERS' ||
                              ticket.name === 'ÅKERBLADS' ||
                              ticket.name === 'BJURSÅS KORSVÄGEN' ||
                              ticket.name === 'ÄLVDALEN STF VANDRARHEM'
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
                       
                        <h3 style={{ borderBottom: '1px solid #333' }}>Konsertbuss - Tur & Retur</h3>
                        {item.gfs
                          .filter(
                            (ticket) =>
                                ticket.name === 'GÄVLE RESECENTRUM 15:30' ||
                                ticket.name === 'LUDVIKA RESECENTRUM 16:00' ||
                                ticket.name === 'SANDVIKEN RESECENTRUM 16:00' ||   
                                ticket.name === 'HOFORS BUSSTATION 16:35' ||
                                ticket.name === 'BORLÄNGE RESECENTRUM 16:45' ||
                                ticket.name === 'DJURÅS BUSSTATION 17:05' ||
                                ticket.name === 'ORSA BUSSTATION 17:10' ||
                                ticket.name === 'FALUN RESECENTRUM 17:15' ||
                                ticket.name === 'INSJÖN HJULTORGET 17.20' ||
                                ticket.name === 'FALUN SCANDIC LUGNET HPL 17:25' ||
                                ticket.name === 'GRYCKSBOKROGEN HPL RV69, 17:30' ||  
                                ticket.name === 'MORAPARKEN SIMHALLEN, 17:30' ||
                                ticket.name === 'LEKSAND HOTELL MOSKOGEN, 17:35' ||
                                ticket.name === 'MORA HOTELL, MORASTRAND 17:35' ||
                                ticket.name === 'BJURSÅS KORSVÄGEN, 17:35' ||
                                ticket.name === 'LEKSAND RESECENTRUM 17:40' ||
                                ticket.name === 'LEKSAND STRAND SILJANSV. 17:45' ||
                                ticket.name === 'MORA RESECENTRUM, 17:45' ||
                                ticket.name === 'DALECARLIA, 18:00' ||
                                ticket.name === 'FIRST HOTEL GYLLENE HORN 18:00' ||
                                ticket.name === 'GREEN HOTEL, 18:00' ||
                                ticket.name === 'KLOCKARGÅRDEN, 18:00' ||
                                ticket.name === 'RÄTTVIK - HANTVERKSBYN, 18:00' ||
                                ticket.name === 'TÄLLBERGSGÅRDEN, 18:00' ||
                                ticket.name === 'VILLA LÅNGBERS, 18:00' ||
                                ticket.name === 'ÅKERBLADS, 18:00' ||
                                ticket.name === 'VIKARBYN HEMKÖP, 18:05' ||
                                ticket.name === 'RÄTTVIK BW LERDALSHÖJDEN 18:10' ||
                                ticket.name === 'UTBY MAJSTÅNGEN, 18:10' ||
                                ticket.name === 'RÄTTVIK ENÅBADET - RV301,18:15' ||
                                ticket.name === 'RÄTTVIK STIFTSGÅRDEN, 18:15' ||
                                ticket.name === 'RÄTTVIK RESECENTRUM, 18:25' ||
                                ticket.name === 'ÄLVDALEN STF VANDRARHEM, 18:30' 
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

                          <h3 style={{ borderBottom: '1px solid #333' }}>Restaurangbuss - Tur & Retur</h3>
                          {item.gfs
                            .filter(
                              (ticket) =>
                                  ticket.name === 'HANTVERKSBYN, 16:20' ||
                                  ticket.name === 'BW HOTELL LERDALSHÖJDEN 16.25' ||
                                  ticket.name === 'ENÅBADET - HPL RV301, 16:30' ||
                                  ticket.name === 'STIFTSGÅRDEN, 16:30' ||
                                  ticket.name === 'RÄTTVIK RESECENTRUM, 16:35' ||
                                  ticket.name === 'RÄTTVIK STIFTSGÅRDEN, 16:40' 
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
