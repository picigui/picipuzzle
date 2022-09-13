import React, { useReducer, useEffect } from 'react';
import styled from 'styled-components';
import 'react-image-crop/dist/ReactCrop.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import '../styles/juego.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useSelector } from 'react-redux';
import imagenVacia from '../assets/0.jpg';
import { ContadorTiempo } from '../utils/ContadorReloj2';
import { getRecors, saveNewRecor } from '../utils/AlmacenDeDatos';

// ************ Styles components *********************
// ****************************************************
let terminado = false;
const EstiloButton = styled.button`
  display: flex;
  border-radius: 3px;
  width: 6rem;
  background-color: yellow;
  border: 2px solid black;
  .link {
    font-size: 1.5rem;
    margin: 0;
    text-align: center;
    text-decoration: none;
    background-color: yellow;
    color: black;
  }
`;

// ****************************************************

// Valores iniciales para los reduce de esta pagina
// y valores que debo recibir de la pagina home
// a traves del objeto store.

function init(initial) {
  return {
    initReloj: null,
    timer: 0,
    count: 0,
    iniciado: false,
    recorAnteriorNombre: 'New player',
    recorAnteriorSegundos: 0,
    jugando: false,
    limiteDeTiempoSuperado: false,
    terminado: false,
    apaisada: false,
    piezas: [],
    piezasOrdenCorrecto: [],
    imgOrderResultadoCorrecto: [],
    nivelSeleccionado: 'n1',
    ancho: 300,
    alto: 400,
    columnas: 3,
    filas: 4,
    imagen300x400: '../assets/imagen06.jpg',
    piezaFuera: imagenVacia,
    piezaVacia: imagenVacia,
    ultimaPieza: imagenVacia,
    ...initial,
  };
}

// ************ Reducer para las actualizaciones de estado ***********
// *******************************************************************

function juegoReducer(state, action) {
  debugger;
  switch (action.type) {
    case 'crearPiezas':
      return {
        ...state,
        piezas: action.payload.arrayPiezas,
        piezasOrdenCorrecto: JSON.parse(
          JSON.stringify(action.payload.arrayPiezas),
        ),
        piezaFuera: action.payload.piezaFuera.src,
        piezaVacia: action.payload.piezaVacia,
        ultimaPieza: action.payload.ultimaPieza,
      };
    case 'iniciado':
      return {
        ...state,
        iniciado: true,
        jugando: false,
        limiteDeTiempoSuperado: false,
      };
    case 'jugando':
      let jugando;
      jugando = false ? jugando : jugando;
      return { ...state, jugando: jugando };
    case 'piezas':
      return { ...state, piezas: action.payload };
    case 'piezaFueraAUltimaPieza':
      return { ...state, piezaFuera: { src: action.payload.src } };
    case 'recor':
      let player = getRecors(state.nivelSeleccionado).player;
      let seconds = getRecors(state.nivelSeleccionado).seconds;
      return {
        ...state,
        recorAnteriorNombre: player,
        recorAnteriorSegundos: seconds,
      };
    case 'piezaFuera':
      return { ...state, piezaFuera: action.payload.src };
    case 'cambioPiezaVacia':
      return { ...state, piezaVacia: state.piezas[action.payload] };
    case 'nuevoGanador':
      return { ...state, nuevoGanador: action.payload };
    case 'nuevoTiempo':
      return {
        ...state,
        seconds: action.payload,
        recorSuperado: state.recorAnteriorSegundos > action.payload,
      };
    case 'empezarJuego':
      return {
        piezaFuera: action.payload[action.payload.length - 1].src,
      };
    case 'ganaste':
      return {
        ...state,
        ultimaPieza: action.payload.ultimaPieza,
        piezaFuera: action.payload.piezaFuera,
        piezas: action.payload.piezas,
        // piezaFuera: { src: action.payload.piezaFuera.src },
        terminado: true,
        jugando: false,
      };
    case 'gano':
      return {
        ...state,
        terminado: true,
      };
    case 'perdio':
      return {
        ...state,
        limiteDeTiempoSuperado: true,
      };
    case 'incrementaCount':
      const count = state.count + 1;
      return { ...state, count };
    case 'incrementaTimer':
      const timer = state.timer + 1;
      return { ...state, timer };
    case 'resetTimer':
      return { ...state, timer: 0 };

    //************** si el dispatch no tiene case *****************
    default:
      throw new Error();
  }
}

// ************ Funcion principal que inicial la pagina ***********
// *******************************************************************

function Juego(initialStateJuego) {
  // vamos a crear una variable objeto para almacenar todos los datos
  // que nos interesan recoger de otra pagina de store que es importado

  const store = useSelector((store) => store);
  const [state, dispatch] = useReducer(juegoReducer, store, init);
  // let piezaVacia;
  // let tiempo = -1;
  let imgOrderResultadoCorrecto = [];
  //let imgOrder = [4, 2, 8, 5, 1, 10, 6, 7, 0, 3, 9, 11];
  let imgOrderRamdon = [];

  useEffect(() => {
    if (state.jugando !== false) {
      dispatch({ type: 'jugando' });
    }
  }, [state.jugando]);

  useEffect(() => {
    if (state.iniciado === false) {
      dispatch({ type: 'iniciado' });
      state.iniciado = true;
      // setTimeout(() => {
      //   crearPiezasCanvas();
      // }, 200);
      crearPiezasCanvas();
    }
  });
  // desde aqui es del nuevo
  // store.jugando = false;
  // store.limiteDeTiempoSuperado = false;
  // useEffect(() => {
  //   if (state.iniciado === false) {
  //     dispatch({ type: 'iniciado' });
  //   }
  // }, [state.iniciado]);
  // dispatch({ type: 'record', payload: state.nivelSeleccionado });
  // if (state.iniciado === false) crearPiezasCanvas();

  //debugger;
  function crearPiezasCanvas() {
    let arrayPiezas = [];
    let piezaCanvas = document.createElement('canvas');
    const imagen300x400 = document.querySelector('.img-foto');
    let piezaFuera = {};
    let ultimaPieza = {};
    let i = 0;
    for (let r = 0; r < state.filas; r++) {
      for (let c = 0; c < state.columnas; c++) {
        // ************ Creando las piezas canvas *********************
        // ************************************************************
        piezaCanvas.width = state.ancho / state.columnas;
        piezaCanvas.height = state.alto / state.filas;
        let posW = r - piezaCanvas.width * c;
        let posH = c - piezaCanvas.height * r;

        let ctx = piezaCanvas.getContext('2d');
        ctx.drawImage(imagen300x400, posW, posH, state.ancho, state.alto);

        // ************ Creando las piezas imagenes *********************
        // ************************************************************
        const dataURL = piezaCanvas.toDataURL();
        arrayPiezas.push({
          id: `${r.toString()}-${c.toString()}`,
          src: dataURL,
          idTablero: `${r.toString()}-${c.toString()}`,
          nImg: i + 1,
          nOrdImg: i,
        });

        // ******** se inicia la variable con la colocacion correcta ******
        // ****************************************************************
        imgOrderResultadoCorrecto[i] = i + 1;
        imgOrderRamdon[i] = i + 1;

        // ******** Recogemos la ultima pieza y la pieza de afuera ******
        // ****************************************************************
        if (r === state.filas - 1 && c === state.columnas - 1) {
          debugger;
          ultimaPieza = { ...arrayPiezas[i] };
          let piezaCanvasVacia = document.createElement('canvas');
          let piezaVacia = document.querySelector('.img-pieza-fuera');
          piezaCanvasVacia.width = state.ancho / state.columnas;
          piezaCanvasVacia.height = state.alto / state.filas;
          // let ctx = piezaCanvasVacia.getContext('2d');
          ctx.drawImage(piezaVacia, 0, 0, state.ancho, state.alto);
          // const dataURLPiezaVacia = piezaCanvasVacia.toDataURL();
          // piezaFuera.src = dataURLPiezaVacia;
          piezaFuera.src = imagenVacia;
          piezaFuera.id = 'vacia';
          piezaFuera.nImg = i + 2;
          piezaFuera.nOrdImg = i + 1;
          piezaVacia = { ...piezaFuera };
          //*********************  Acualizamos el estado ***********************
          // ****************************************************************
          dispatch({
            type: 'crearPiezas',
            payload: {
              arrayPiezas,
              piezaFuera,
              piezaVacia,
              ultimaPieza,
            },
          });
        }
        i++;
      }
    }
  }

  // ****** Creando los eventos del movimiento de piezas *******
  // mover una imagen mientras esta clikeada.
  function dragOver(e) {
    e.preventDefault();
  }
  // dejar una imagen en otro lugar
  function dragEnter(e) {
    e.preventDefault();
  }
  // arrastrar la imagen a otra imagen
  function dragLeave(e) {
    e.preventDefault();
  }
  // arrastrar la imagen a otra imagen, suelta la imagen
  function dragDrop(e) {
    e.preventDefault();
  }

  // despues de arrastrar y soltar, intercambie los dos piezas
  function dragEnd(pieza) {
    //debugger;
    // Tomo nota de las coodenadas de la pieza pinchada.
    let actualPieza = pieza;
    debugger;
    let actualCoords = actualPieza.idTablero.split('-'); // nos dará "0-0" --> ["0", "0"]
    let r = parseInt(actualCoords[0]);
    let c = parseInt(actualCoords[1]);

    // Tomo nota de las coodenadas de la pieza vacia.

    let vaciaCoords = state.piezaVacia.idTablero.split('-'); // nos dará "0-0" --> ["0", "0"]
    let r2 = parseInt(vaciaCoords[0]);
    let c2 = parseInt(vaciaCoords[1]);

    // Compruebo si la pieza que vamos a mover es adjacente a la pieza blanca
    // para permitir el movimiento.
    let moveLeft = r === r2 && c2 === c - 1;
    let moveRight = r === r2 && c2 === c + 1;

    let moveUp = c === c2 && r2 === r - 1;
    let moveDown = c === c2 && r2 === r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
    if (isAdjacent) {
      const copia = state.piezaVacia;
      const indexPiezaVacia = state.piezas.findIndex(
        (p) => p.id === state.piezaVacia.id,
      );
      const indexPiezaActual = state.piezas.findIndex(
        (p) => p.id === actualPieza.id,
      );
      const nuevasPiezas = [...state.piezas];
      nuevasPiezas[indexPiezaActual] = copia;
      nuevasPiezas[indexPiezaVacia] = state.piezas[indexPiezaActual];
      // state.piezas = [...nuevasPiezas]; esto estaba en el nuevo
      const idsEnOrden = state.piezasOrdenCorrecto.map((p) => p.id);
      nuevasPiezas.forEach((p, index) => (p.idTablero = idsEnOrden[index]));
      dispatch({ type: 'piezas', payload: nuevasPiezas }); //y esto lo quité
      dispatch({ type: 'cambioPiezaVacia', payload: indexPiezaActual });
      siCompleto();
    }
  }
  function siCompleto() {
    // let estaOrdenado = true;
    // for (let i = 0; i < state.piezas.length - 1; i++) {
    //   if (state.piezas[i].nImg !== i + 1) {
    //     estaOrdenado = false;
    //   }
    // } las lineas de abajo se cambiaron por las anteriores en el nuevo
    let estaOrdenado = false;
    estaOrdenado =
      JSON.stringify(state.piezas.slice(0, state.piezas.length - 1)) ===
      JSON.stringify(
        state.piezasOrdenCorrecto.slice(
          0,
          state.piezasOrdenCorrecto.length - 1,
        ),
      );
    // console.log(JSON.stringify(state.piezas.slice(0, state.piezas.length - 1)));
    // console.log(
    //   JSON.stringify(
    //     state.piezasOrdenCorrecto.slice(
    //       0,
    //       state.piezasOrdenCorrecto.length - 1,
    //     ),
    //   ),
    // );
    if (estaOrdenado) {
      const piezas = JSON.parse(JSON.stringify(state.piezas));
      const ultimaPieza =
        state.piezasOrdenCorrecto[state.piezasOrdenCorrecto.length - 1];
      const piezaFuera = piezas.pop();
      piezas.push(ultimaPieza);

      // store.terminado = true; esto es del nuevo
      // dispatch({
      //   type: 'ganaste',
      //   payload: { piezas, piezaFuera: piezaFuera },
      // }); este dispatch estaba en el nuevo. y sin la llamada a la funcion gano

      dispatch({
        type: 'Ganaste',
        payload: { piezas, ultimaPieza, piezaFuera },
      });
      gano();
    }
    Counter();
  }
  // esta función se ejecuta cuando se clickea en el boton empezar y realiza
  // un reordenado de las piezas para empezar el juego
  function empezarJuego() {
    debugger;
    // dispatch({ type: 'resetTimer' });
    // Revisar en un futuro se acelera al volver a renderizar el puzzle.
    // if (tiempo !== -1) {
    //   clearInterval(tiempo);
    // }
    // tiempo = setInterval(() => {
    //   dispatch({ type: 'incrementaTimer' });
    // }, 1000);
    // terminado = false;
    // las lineas anteriores se quitaron en el nuevo desde el debugger

    const copia = JSON.parse(JSON.stringify(state.piezasOrdenCorrecto));
    const idsEnOrden = copia.map((p) => p.id);
    const ultimaPieza = copia.pop();
    dispatch({
      type: 'piezaFuera',
      payload: JSON.parse(JSON.stringify(ultimaPieza)),
    });
    // dispatch({
    //   type: 'piezaFueraAUltimaPieza',
    //   payload: { ...ultimaPieza },
    // }); este dispatch es del nuevo

    shuffle(copia);
    copia.push(ultimaPieza);
    ultimaPieza.src = imagenVacia;
    // debugger;
    idsEnOrden.forEach((id, index) => (copia[index].idTablero = id));
    store.initReloj = true;
    store.jugando = true;
    dispatch({ type: 'jugando' });
    dispatch({ type: 'piezas', payload: copia });
    dispatch({ type: 'cambioPiezaVacia', payload: copia.length - 1 });
  }

  // Esta funcion se encarga de reorganizar cualquier array que le envies
  // como props
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    // mientras hayan elementos para reordenar.
    while (currentIndex !== 0) {
      // Elija un elemento restante.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // Y cámbielo por el elemento actual.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function cambiarNombreRecor(nuevoNombre) {
    dispatch({ type: 'nuevoGanador', payload: nuevoNombre });
  }
  function guardarRecor() {
    saveNewRecor(state.nuevoGanador, state.seconds, state.nivelSeleccionado);
  }

  function Counter() {
    return dispatch({ type: 'incrementaCount' });
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
        <title>Pici - Puzzle - `(Juego)` 🤓</title>
      </Helmet>
      <Header />
      <main>
        {/******** Mensaje para presentar el recor anterior *******/}
        {/**********************************************************************/}
        <div className="cuadro__recor-anterior" id="oculta">
          <p>
            <b>Recor anterior de </b>
            {state.recorAnteriorNombre}
          </p>
          <p>
            <b>Tiempo: </b>
            {state.recorAnteriorSegundos} segundos
          </p>
          {/**********************************************************************/}
          {state.terminado && state.recorSuperado ? (
            <div>
              <input
                onChange={(e) => cambiarNombreRecor(e.target.value)}
                type="text"
                placeholder="Tu nombre"
              />
              <button onClick={guardarRecor}>Guardar puntuación</button>
            </div>
          ) : (
            ''
          )}
        </div>
        {/**********************************************************************/}

        <div className="juego">
          {/*************** presentacion del tablero de juego ********************/}
          {/**********************************************************************/}
          <div className="contenedor-tablero">
            <div
              className={`grid-tablero ${
                state.apaisada === true
                  ? 'grid-tablero-apaisado'
                  : 'grid-tablero-apaisado-no'
              } grid-${state.nivelSeleccionado}`}
            >
              {state.piezas.map((img, index) => {
                return (
                  <img
                    onDragOver={(e) => dragOver(e)}
                    onDragEnter={(e) => dragEnter(e)}
                    onDragLeave={(e) => dragLeave(e)}
                    onDrop={(e) => dragDrop(e)}
                    onDragEnd={(e) => dragEnd(img)}
                    src={img.src}
                    id={img.id}
                    key={img.id}
                    alt={img.id}
                  ></img>
                );
              })}
            </div>

            {/***** Grid que contiene el avance del juego y la ultima pieza *******/}
            {/**********************************************************************/}
            <div
              className={`grid-ultima-pieza ${
                state.apaisada === true ? 'grid-apaisado' : 'grid-apaisado-no'
              }`}
            >
              <div className="h3-mov-time">
                <h3 className="h3-movimientos">
                  Pasos: <span id="movimientos">{state.count}</span>
                </h3>
                {/* <h3 className="h3-tiempo">Tiempo:</h3>
                <span id="tiempo">{state.timer}</span> */}
                {/* <ContadorReloj
                  tiempoFinalizado={tiempoFinalizado}
                  jugando={state.jugando}
                /> */}
                <ContadorTiempo
                  jugando={state.jugando}
                  limiteDeTiempoSuperado={store.limiteDeTiempoSuperado}
                />
              </div>
              <div className="botones">
                <div className="empezar">
                  <button
                    onClick={empezarJuego}
                    className="btn-empezar"
                    type="button"
                  >
                    Empezar
                  </button>
                  <EstiloButton>
                    <Link className="link" to="/">
                      Home
                    </Link>
                  </EstiloButton>
                </div>
              </div>
              <div className="div-img-pieza-fuera">
                <img
                  className="img-pieza-fuera"
                  src={state.piezaFuera ? state.piezaFuera : '../assets/0.jpg'}
                  alt="img-pieza-fuera"
                  onDragOver={(e) => dragOver(e)}
                  onDragEnter={(e) => dragEnter(e)}
                  onDragLeave={(e) => dragLeave(e)}
                  onDrop={(e) => dragDrop(e)}
                  onDragEnd={(e) => dragEnd(e)}
                />
              </div>
            </div>
          </div>
          {/*************** Mensaje para presentar al final del juego *************/}
          {/**********************************************************************/}
          <h2
            className="mensaje-gano"
            id={`${terminado === true ? '' : 'ocultar'}`}
          >
            !!! Puzzle Completado ¡¡¡
          </h2>
          {/******** Mensaje para presentar si supera el tiempo limite del juego *******/}
          {/**********************************************************************/}
          <h2
            className="mensaje-perdio"
            return
            id={`${state.limiteDeTiempoSuperado === true ? '' : 'ocultar'}`}
          >
            !!! 😭😭 Tiempo límite superado 😭😭 ¡¡¡
          </h2>

          {/*************** presentacion de la imagen elegida *******************/}
          {/**********************************************************************/}

          <div className="marco-foto">
            <div
              className={`foto-elegida ${
                state.apaisada === true ? 'foto-apaisada' : 'foto-apaisada-no'
              }`}
            >
              <img
                className="img-foto"
                src={state.imagen300x400}
                alt="imagen elegida"
              ></img>
            </div>
          </div>
        </div>
        <button
          className="btn-empezar"
          type="button"
          onClick={gano}
          id="ocultar"
        >
          ganó
        </button>
        <button
          className="btn-empezar"
          type="button"
          onClick={perdio}
          id="ocultar"
        >
          perdió
        </button>
        <button
          className="btn-empezar"
          id="ocultar"
          type="button"
          onClick={hacerTrampa}
        >
          trampa
        </button>
      </main>
      <Footer />
    </>
  );
  function gano() {
    terminado = true;
    return dispatch({ type: 'gano' });
  }
  function perdio() {
    terminado = false;
    return dispatch({ type: 'perdio' });
  }
  function hacerTrampa() {
    console.log('Las ordeno');
    console.log({ piezas: state.piezas });
    const ordenadas = JSON.parse(JSON.stringify(state.piezas)).sort(compare);
    console.log({ piezas: ordenadas });
    state.piezasOrdenCorrecto.forEach(
      (p, idx) => (ordenadas[idx].idTablero = p.idTablero),
    );
    const ultima = ordenadas.pop();
    const penultima = ordenadas.pop();
    ordenadas.push(ultima);
    ordenadas.push(penultima);
    dispatch({ type: 'piezas', payload: ordenadas });
    dispatch({ type: 'cambioPiezaVacia', payload: ordenadas.length - 2 });
  }

  function compare(a, b) {
    if (a.nImg < b.nImg) {
      return -1;
    }
    if (a.nImg > b.nImg) {
      return 1;
    }
    return 0;
  }
}
export default Juego;

//REPARAR-ESTO: CAMBIAR ESTO
//PENDIENTE-HACER:: CAMBIAR ESTO
//REVISAR: CAMBIAR ESTO
//XXX: CAMBIAR ESTO
