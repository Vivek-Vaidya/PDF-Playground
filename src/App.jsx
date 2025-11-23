import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

import Merge from './pages/Merge';

// Placeholder components for now
import Split from './pages/Split';

import Convert from './pages/Convert';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge" element={<Merge />} />
          <Route path="/split" element={<Split />} />
          <Route path="/convert" element={<Convert />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
