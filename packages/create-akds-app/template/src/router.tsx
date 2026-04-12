import { Routes, Route } from 'react-router';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';

export function AppRouter() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}
