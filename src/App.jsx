import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
import Merge from './pages/Merge';
import Split from './pages/Split';
import Convert from './pages/Convert';
import Rotate from './pages/Rotate';
import Protect from './pages/Protect';
import Watermark from './pages/Watermark';
import Organize from './pages/Organize';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<Merge />} />
        <Route path="/split" element={<Split />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/rotate" element={<Rotate />} />
        <Route path="/protect" element={<Protect />} />
        <Route path="/watermark" element={<Watermark />} />
        <Route path="/organize" element={<Organize />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </ToastProvider>
    </Router>
  );
}

export default App;
