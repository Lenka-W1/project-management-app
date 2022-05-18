import { CircularProgress, styled } from '@mui/material';

function Preloader() {
  return <StyledPreloader color="primary" />;
}

export default Preloader;

const StyledPreloader = styled(CircularProgress)`
  position: absolute;
  top: 45%;
  z-index: 2;
`;
