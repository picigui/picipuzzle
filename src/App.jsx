import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import Juego from './pages/Juego';
import ErrorPage from './pages/Error';

const App = () => {
  return (
    <Provider store={store}>
      {/* Esta orden de arriba es para que el redux nos conceda acceso
      general al store desde cualquier pagina de la app. */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/juego" element={<Juego />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
