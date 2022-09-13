import React, { useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
let tiempo;
const EstiloReloj = styled.div`
  display: flex;
  position: relative;
  border-radius: 3px;
  width: 6rem;
  height: 3em;
  margin-right: 0.5em;
  background-color: black;
  border: 2px solid black;

  .tiempo {
    margin-top: 0.2em;
    font-size: 1.2em;
    text-align: center;
    color: greenyellow;
    font-family: monospace;
  }
`;

function init(initialStateTimer) {
  return {
    terminado: (Boolean, 'false'),
    tiempo: 0,
    maxMinutos: 3600,
    ...initialStateTimer,
  };
}
function tiempoReducer(state, action) {
  debugger;
  switch (action.type) {
    case 'incrementaTiempo':
      // const tiempo = state.tiempo + 1;
      return { ...state, tiempo: state.tiempo + 1 };
    case 'limiteDeTiempoSuperado':
      clearInterval(tiempo);

      return {
        ...state,
        jugando: true,
        maxMinutos: 0,
      };
    case 'resetTiempo':
      return { ...state, tiempo: 0 };

    //************** si el dispatch no tiene case *****************
    default:
      throw new Error();
  }
}
export function ContadorTiempo({ jugando, limiteDeTiempoSuperado }) {
  debugger;
  const store = useSelector((store) => store);
  const [state, dispatch] = useReducer(
    tiempoReducer,
    { jugando, limiteDeTiempoSuperado },
    init,
  );
  useEffect(() => {
    debugger;

    if (jugando !== false) {
      tiempo = setInterval(() => {
        dispatch({ type: 'incrementaTiempo' });
      }, 1000);
    } else {
      clearInterval(tiempo);
    }
  }, [jugando]);

  const timeFormat = (tiempo) => {
    if (tiempo === state.maxMinutos) {
      store.limiteDeTiempoSuperado = true;
      return dispatch({ type: 'limiteDeTiempoSuperado' });
    }
    debugger;
    // if (tiempo===0) return '00:00:00';
    let resto = 0;
    let horas = 0;
    let minutos = 0;
    let segundos = tiempo;

    if (tiempo >= 3600) {
      horas = Math.trunc(tiempo / 3600);
      resto = tiempo % 3600;
      minutos = Math.trunc(resto / 60);
      segundos = resto % 60;
    }
    if (tiempo < 3600 && tiempo >= 60) {
      minutos = Math.trunc(tiempo / 60);
      segundos = tiempo % 60;
    }

    let hh = horas;
    let mm = minutos;
    let ss = segundos;

    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    ss = ss < 10 ? '0' + ss : ss;
    // if (tiempo < 60) return `00:00:${ss}`;
    // if (!jugando) return `${hh}:${mm}:${ss}`;
    return `${hh}:${mm}:${ss}`;
  };

  // dispatch({ type: 'resetTiempo' });
  // Revisar en un futuro se acelera al volver a renderizar el puzzle.
  // let tiempo = -1;
  // if (state.tiempo <= 5000) {
  // let tiempo = setInterval(() => {
  //   dispatch({ type: 'incrementaTiempo', payload: tiempo });
  // }, 1000);
  // }
  // if (state.tiempo === 5000) {
  //   dispatch({ type: 'resetTiempo' });
  // }
  return (
    <EstiloReloj>
      <p className="tiempo">Tiempo: {timeFormat(state.tiempo)}</p>
    </EstiloReloj>
  );
}
// eslint-disable-next-line react-hooks/exhaustive-deps
