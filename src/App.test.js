import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
import Home from './pages/Home';
import Juego from './pages/Juego';

import { getImagenes } from './utils/imagenes';

test('Aplicación muestra título juego', () => {
  render(<App />);
  const linkElement = screen.getByText(/Pici Puzzle/i);
  expect(linkElement).toBeInTheDocument();
});

xtest('Home muestra título en Home', () => {
  render(<Home />);
  const linkElement = screen.getByText(/Pici Puzzle/i);
  expect(linkElement).toBeInTheDocument();
});

xtest('Juego muestra texto movimientos en vista Juego', () => {
  render(
    <Router>
      <Provider store={store}>
        <Juego location={{ pathName: '/' }} />
      </Provider>
    </Router>,
  );
  const linkElement = screen.getByText(/Movimientos:/i);
  expect(linkElement).toBeInTheDocument();
});

test('Aplicación muestra opcion de imagenes incluidas', () => {
  render(<App />);
  const opcion1 = screen.getByText(/Imagenes incluidas/i);
  expect(opcion1).toBeInTheDocument();
});

test('Aplicación muestra la opcion de Imagenes de la API', () => {
  render(<App />);
  const opcion2 = screen.getByText(/Imagenes de la API/i);
  expect(opcion2).toBeInTheDocument();
});

test('Aplicación muestra opcion de Imagenes de la galeria', () => {
  render(<App />);
  const opcion3 = screen.getByText(/De tus Galeria/i);
  expect(opcion3).toBeInTheDocument();
});

test('Metodo getImagenes incluidas devuelve 9 elementos', () => {
  const imagenes = getImagenes();
  expect(imagenes.length).toBe(9);
});
