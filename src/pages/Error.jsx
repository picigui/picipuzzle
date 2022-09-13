import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const StyledErrorPage = styled.div`
  margin: 2rem auto auto;
  max-width: 50%;
  border: 5px solid red;
  text-decoration: none;
  text-align: center;
  background-color: pink;
  .link {
    font-size: 1.5rem;
    margin-left: 10px;
    text-align: center;
    text-decoration: none;
    color: black;
  }
`;

const ErrorPage = () => {
  return (
    <>
      <Helmet>
        <title>Pagina no encontrada 😢</title>
      </Helmet>
      <StyledErrorPage>
        <h1>Error</h1>
        <p>Página no encontrada</p>
        <p>
          Por favor dirijase a la
          <Link className="link" to="/">
            Principal
          </Link>
        </p>
      </StyledErrorPage>
    </>
  );
};

export default ErrorPage;
