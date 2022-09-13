import React, { useReducer } from 'react';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../styles/index.css';

/***************  Carga de imagenes predeterminadas ************/

// Se importa esta funcion para poder asceder al Store almacenado
import { useSelector } from 'react-redux';
import { getImagenes } from '../utils/imagenes';
const imagenes = getImagenes();

const niveles = [
  {
    name: 'Nivel 1 (12 piezas)',
    value: 'n1',
    columnas: 3,
    filas: 4,
    seleccionado: true,
  },
  {
    name: 'Nivel 2 (24 piezas)',
    value: 'n2',
    columnas: 4,
    filas: 6,
    seleccionado: false,
  },
  {
    name: 'Nivel 3 (48 piezas)',
    value: 'n3',
    columnas: 6,
    filas: 8,
    seleccionado: false,
  },
];

const EstiloButton = styled.button`
  display: inline-block;
  position: relative;
  align-content: center;
  background-color: yellow;
  text-align: center;
  border-radius: 5px;
  padding: 0.3em;
  margin: 0 auto;
  width: 6rem;
  border: 2px solid;
  .link {
    font-size: 1.5rem;
    text-align: center;
    text-decoration: none;
    color: black;
  }
`;

// let nivelSeleccionado = 'n1';
// let apaisada = false;

//init();
function init() {
  return {
    imageURL: imagenes[0].url,
    imagenes,
    apaisada: false,
    nivelSeleccionado: 'n1',
    columnas: 3,
    filas: 4,
    ancho: 300,
    alto: 400,
    niveles,
    origenImagen: 'imgIncluidas',
    imagenesAPI: [],
  };
}
function configJuegoReducer(state, action) {
  let ancho = 300;
  let alto = 400;
  let columnas = 3;
  let filas = 4;

  switch (action.type) {
    // ********** eleccion de la fuente de la imagen ***********
    case 'imgIncluidas':
      return {
        ...state,
        origenImagen: 'imgIncluidas',
        imageURL: imagenes[0].url,
      };
    case 'imgAPI':
      return {
        ...state,
        origenImagen: 'imgAPI',
        imageURL: imagenes[0].url,
      };
    case 'imgGaleria':
      return {
        ...state,
        origenImagen: 'imgGaleria',
        imageURL: imagenes[0].url,
      };

    // ********** eleccion de la fuente de la imagen ***********
    case 'seleccionadaImagenIncluidas':
      return { ...state, imageURL: imagenes[action.payload].url };

    // ************ imagenes de la galeria del usuario **********
    case 'imagenGaleria':
      return { ...state, imageURL: action.payload };

    // ************ imagenes de la galeria del usuario **********
    case 'imagenAPI':
      return {
        ...state,
        imagenesAPI: action.payload,
        imageURL: action.payload[0].url,
      };

    // ************** imagenes vertical/apaisado *****************
    case 'apaisada':
      document.querySelector('.foto-elegida').id = 'apaisada';
      ancho = 400;
      alto = 300;
      if (state.nivelSeleccionado === 'n1') {
        columnas = 4;
        filas = 3;
      }
      if (state.nivelSeleccionado === 'n2') {
        columnas = 6;
        filas = 4;
      }
      if (state.nivelSeleccionado === 'n3') {
        columnas = 8;
        filas = 6;
      }

      return { ...state, ancho, alto, filas, columnas, apaisada: true };
    case 'apaisadaNo':
      document.querySelector('.foto-elegida').id = 'apaisada-no';
      ancho = 300;
      alto = 400;
      if (state.nivelSeleccionado === 'n1') {
        columnas = 3;
        filas = 4;
      }
      if (state.nivelSeleccionado === 'n2') {
        columnas = 4;
        filas = 6;
      }
      if (state.nivelSeleccionado === 'n3') {
        columnas = 6;
        filas = 8;
      }

      return { ...state, ancho, alto, filas, columnas, apaisada: false };

    // ************** eleccion del nivel de juego ***************
    case 'n1':
      if (state.apaisada) {
        columnas = 4;
        filas = 3;
      } else {
        columnas = 3;
        filas = 4;
      }
      for (let i = 1; i < niveles.length; i++) {
        niveles[i].seleccionado = false;
      }
      niveles[0].seleccionado = true;
      return { ...state, niveles, columnas, filas, nivelSeleccionado: 'n1' };
    case 'n2':
      if (state.apaisada) {
        columnas = 6;
        filas = 4;
      } else {
        columnas = 4;
        filas = 6;
      }
      for (let i = 0; i < niveles.length; i++) {
        niveles[i].seleccionado = false;
      }
      niveles[1].seleccionado = true;
      debugger;
      return { ...state, niveles, columnas, filas, nivelSeleccionado: 'n2' };
    case 'n3':
      if (state.apaisada) {
        columnas = 8;
        filas = 6;
      } else {
        columnas = 6;
        filas = 8;
      }
      for (let i = 0; i < niveles.length; i++) {
        niveles[i].seleccionado = false;
      }
      niveles[2].seleccionado = true;
      return { ...state, niveles, columnas, filas, nivelSeleccionado: 'n3' };
    case 'jugar':
      return { ...state };

    // ************** si el dispatch no tiene case *****************
    default:
      throw new Error();
  }
}

// later

function Home({ initialState }) {
  const [state, dispatch] = useReducer(configJuegoReducer, initialState, init);
  // vamos a crear una variable objeto para almacenar todos los datos
  // que nos interesan pasar a otra pagina
  const store = useSelector((store) => store);
  store.imageURL = imagenes[0].url;
  debugger;
  function callAPIGatitos() {
    fetch(
      'https://api.thecatapi.com/v1/images/search?limit=3&page=1&mime_types=jpg,png',
    )
      .then((res) => res.json())
      .then((res) => {
        dispatch({ type: 'imgAPI', payload: res });
        dispatch({ type: 'imagenAPI', payload: res });
      });
  }

  const changeSelectedImg = (e) => {
    dispatch({ type: 'seleccionadaImagenIncluidas', payload: e.target.value });
  };
  const changeSelectedNivel = (e) => {
    dispatch({ type: e.target.value });
    store.nivelSeleccionado = e.target.value;
  };

  function mostrarImagenElegida(event) {
    let file = event.target.files[0];
    //  console.log(event.target.files[0]);
    let reader = new FileReader('');
    reader.onload = function (event) {
      dispatch({ type: 'imagenGaleria', payload: event.target.result });
      //  console.log(event.target.result);
    };
    reader.readAsDataURL(file);
  }
  function irAlJuego() {
    store.nivelSeleccionado = state.nivelSeleccionado;
    store.apaisada = state.apaisada;
    store.ancho = state.ancho;
    store.alto = state.alto;
    store.columnas = state.columnas;
    store.filas = state.filas;
    store.imagen300x400 = state.imageURL;
    dispatch({ type: 'jugar' });
    console.log(store);
    return;
  }
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          type="image/png"
          sizes="24x33"
          href="../assets/logo-pici24x33.png"
        />
        <title>Pici - Puzzle {'Home'} 😀</title>
      </Helmet>
      <Header />
      <main>
        <h2>Configura tu imagen del Pici-Puzzle</h2>
        <br></br>
        <div className="elegir-fuente-imagen">
          {/*************** Elección del origen de la imagen  ********************/}

          <input
            type="radio"
            name="tipo-de-fuente-img"
            id="imgIncluidas"
            select="true"
            defaultChecked
            onChange={() => dispatch({ type: 'imgIncluidas' })}
          />
          <label htmlFor="imgIncluidas"> Imagenes incluidas </label>

          <input
            type="radio"
            name="tipo-de-fuente-img"
            id="imgAPI"
            onChange={() => callAPIGatitos()}
          />
          <label htmlFor="imgAPI"> Imagenes de la API </label>

          <input
            type="radio"
            name="tipo-de-fuente-img"
            id="imgGaleria"
            onChange={() => dispatch({ type: 'imgGaleria' })}
          />
          <label htmlFor="imgGaleria"> De tus Galeria </label>

          <div
            className="cuadro-carga-imagen"
            id={state.origenImagen === 'imgAPI' ? 'ocultar' : ''}
          >
            {/********** selección de la imagen incluidas en la APP *************/}
            <div
              className={`elegir-source imgIncluidas ${
                state.origenImagen === 'imgIncluidas' ? 'elegido' : ''
              }`}
            >
              <label htmlFor="img-incluida">
                Elige la imagen con la que quieres jugar:{' '}
              </label>
              <select
                name="img-incluida"
                id="img-incluida"
                onChange={(e) => changeSelectedImg(e)}
                defaultValue={0}
              >
                {state.imagenes.map((img, index) => (
                  <option name="img-incluida" value={index} key={img.url}>
                    {img.name}
                  </option>
                ))}
              </select>
            </div>

            {/*************** selección de la imagen en la Galeria *******************/}

            <div
              className={`elegir-source imgGaleria ${
                state.origenImagen === 'imgGaleria' ? 'elegido' : ''
              }`}
            >
              <input
                id="inputFile1"
                onChange={mostrarImagenElegida}
                type="file"
                accept=".jpg,.png,.bmp"
              />
            </div>
          </div>
          {/*************** Elección del nivel de juego ***************************/}
          <div className="elige-nivel">
            <form>
              <label htmlFor="nivel">
                Elige el nivel al que quieres jugar:
              </label>
              <select
                name="nivel"
                id="nivel"
                onChange={(e) => changeSelectedNivel(e)}
                defaultValue={'n1'}
              >
                {state.niveles.map((nivel, index) => (
                  <option
                    name="nivel"
                    value={nivel.value}
                    key={index + '-' + nivel.totalPiezas}
                  >
                    {nivel.name}
                  </option>
                ))}
              </select>
            </form>
          </div>
          <EstiloButton id={state.origenImagen === 'imgAPI' ? 'ocultar' : ''}>
            <Link
              className="link"
              id={state.origenImagen === 'imgAPI' ? 'ocultar' : ''}
              onClick={irAlJuego}
              to="/juego"
            >
              Jugar
            </Link>
          </EstiloButton>

          {/*************** selección formato de la imagen *******************/}

          <div className="div-vertical-apaisada">
            <div className="div-vertical">
              <label htmlFor="vertical-apaisada"> Vertical </label>
              <input
                type="radio"
                name="vertical-apaisada"
                defaultChecked
                onChange={() =>
                  dispatch({ type: 'apaisadaNo', payload: false })
                }
              />
            </div>
            <div className="div-apaisada">
              <label htmlFor="vertical-apaisada"> Apaisada </label>
              <input
                type="radio"
                name="vertical-apaisada"
                onChange={() => dispatch({ type: 'apaisada', payload: true })}
              />
            </div>
          </div>
        </div>
        {/*************** presentacion de la imagen elegida ***************************/}
        <div className="marco-foto">
          <div className="foto-elegida" id="apaisadaNo">
            <img
              className="img-foto"
              src={state.imageURL}
              alt="imagen elegida"
            />
          </div>
        </div>
        {/*************** selección de la imagen en la API *******************/}
        <div
          className={`elegir-source imgAPI ${
            state.origenImagen === 'imgAPI' ? 'elegido' : ''
          }`}
        >
          <div className="api-buttons-y-notas">
            <div className="notas">
              <p>
                Con el botón<span> Recargar </span>e irás repasando las imágenes
                de la API de 3 en 3, cuando encuentres una que te gusta elígela
                y luego en la presentación de la imagen has click para desplegar
                el menu y guarda la imagen en una carpeta, luego la eliges desde
                tu galería y a !!! jugar ¡¡¡.
              </p>
            </div>
            <button className="btn__recargar-api" onClick={callAPIGatitos}>
              Recargar
            </button>
          </div>
          <div className="grid-img__api">
            {state.imagenesAPI.map((img) => (
              <img
                onClick={() =>
                  dispatch({
                    type: 'imagenGaleria',
                    payload: img.url,
                  })
                }
                src={img.url}
                alt=""
                key={img.id}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
//debugger;
export default Home;
