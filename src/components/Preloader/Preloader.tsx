import { CircularProgress, styled } from '@mui/material';

function Preloader() {
  return <StyledPreloader color="primary" />;
}

export default Preloader;

const StyledPreloader = styled(CircularProgress)`
  position: absolute;
  margin-left: 50vw;
  margin-top: 50vh;
  z-index: 3;
`;
