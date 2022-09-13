import img1 from '../assets/imagen01.jpg';
import img2 from '../assets/imagen02.jpg';
import img3 from '../assets/imagen03.jpg';
import img4 from '../assets/imagen04.jpg';
import img5 from '../assets/imagen05.jpg';
import img6 from '../assets/imagen06.jpg';
import img7 from '../assets/imagen07.jpg';
import img8 from '../assets/imagen08.jpg';
import img9 from '../assets/imagen09.jpg';

const imagenes = [
  { url: img1, name: 'Imagen 1' },
  { url: img2, name: 'Imagen 2' },
  { url: img3, name: 'Imagen 3' },
  { url: img4, name: 'Imagen 4' },
  { url: img5, name: 'Imagen 5' },
  { url: img6, name: 'Imagen 6' },
  { url: img7, name: 'Imagen 7' },
  { url: img8, name: 'Imagen 8' },
  { url: img9, name: 'Imagen 9' },
];

export function getImagenes() {
  return imagenes;
}
