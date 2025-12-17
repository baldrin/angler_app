import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { ApiClient } from '@arkansas-flow/shared';

const client = new ApiClient({ baseUrl: 'http://localhost:4000' });

function StationList() {
  const [stations, setStations] = React.useState<any[]>([]);
  React.useEffect(() => {
    client.getStations().then(setStations).catch(console.error);
  }, []);
  return (
    <div>
      <h2>Stations</h2>
      <ul>
        {stations.map((s) => (
          <li key={s.siteId}><Link to={`/station/${s.siteId}`}>{s.name}</Link></li>
        ))}
      </ul>
    </div>
  );
}

function StationDetail() {
  const { siteId } = useParams();
  const [data, setData] = React.useState<any>();
  React.useEffect(() => {
    if (siteId) client.getRealtime(siteId).then(setData);
  }, [siteId]);
  if (!data) return <div>Loading...</div>;
  return (
    <div>
      <h2>Station {siteId}</h2>
      <p>Discharge: {data.discharge} cfs</p>
      <p>Classification: {data.classification?.label}</p>
      <p>Trend: {data.trend}</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Arkansas River & Stream Flow Tracker</h1>
        <nav><Link to="/">Map</Link></nav>
      </header>
      <Routes>
        <Route path="/" element={<StationList />} />
        <Route path="/station/:siteId" element={<StationDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
