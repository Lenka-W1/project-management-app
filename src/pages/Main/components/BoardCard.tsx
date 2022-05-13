import React from 'react';
import { Card, CardMedia, IconButton, styled, Tooltip, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { BoardResponseType } from '../../../API/API';

type BoardCardPropsType = {
  setOpenConfirmModal: (deleteValue: BoardResponseType | null) => void;
};
function BoardCard(props: BoardResponseType & BoardCardPropsType) {
  const { id, title, description } = props;
  const deleteBoard = () => {
    props.setOpenConfirmModal({ id: id, title: title, description: description });
  };
  return (
    <StyledBoardCard>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2">{description}</Typography>
      <Tooltip title="Delete board">
        <IconButton aria-label="delete" color={'error'} onClick={deleteBoard}>
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit board">
        <IconButton aria-label="delete" color={'success'}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <CardMedia
        component="img"
        height="140"
        image="https://ichef.bbci.co.uk/images/ic/1200x675/p01lymgh.jpg"
      />
    </StyledBoardCard>
  );
}

export default BoardCard;

const StyledBoardCard = styled(Card)`
  width: 300px;
  margin: 17px;
  position: relative;

  h6,
  p {
    position: absolute;
    color: white;
    left: 5%;
  }

  p {
    top: 20%;
  }

  button {
    position: absolute;
    padding: 0;
    top: 5%;
    right: 2%;
    visibility: hidden;
  }
  button:nth-of-type(2n) {
    right: 10%;
    visibility: hidden;
  }
  img:hover {
    cursor: pointer;
  }
  &:hover {
    button {
      visibility: visible;
    }
  }
`;
