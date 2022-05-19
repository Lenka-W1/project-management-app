import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BoardResponseType,
  BoardType,
  ColumnResponseType,
  ColumnType,
  UserResponseType,
} from '../../API/API';
import styled from 'styled-components';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormModal from '../../components/ModalWindows/FormModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import { fetchBoard } from '../../BLL/reducers/board-reducer';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Column from './components/Column';
import { PATH } from '../AppRoutes';
import ConfirmationModal from '../../components/ModalWindows/confirmationModal';

function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatchType>();
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = React.useState<
    ColumnResponseType | BoardResponseType | UserResponseType | null
  >(null);
  const board = useSelector<AppStateType, BoardType>((state) => state.boards.currentBoard);
  const columns = useSelector<AppStateType, Array<ColumnType>>((state) => state.columns.columns);
  console.log(columns);
  useEffect(() => {
    if (id) dispatch(fetchBoard(id));
  }, [dispatch, id]);
  const handleOpenModal = (isOpen: boolean) => {
    setOpenFormModal(isOpen);
  };
  const columnElements = columns.map((c) => {
    return (
      <Column
        key={c.id}
        columnId={c.id}
        title={c.title}
        order={c.order}
        tasks={c.tasks}
        setOpenConfirmModal={setOpenConfirmModal}
      />
    );
  });
  return (
    <RootContainer>
      <Button
        variant={'text'}
        startIcon={<ArrowBackOutlinedIcon />}
        onClick={() => navigate(PATH.MAIN)}
      >
        Back
      </Button>
      <BoardInfo>
        <h2>
          Board <b>{board.title}</b>
        </h2>
        <h3>{board.description}</h3>
      </BoardInfo>
      <ColumnContainer>
        {columnElements}
        <CreateColumnButton
          startIcon={<AddIcon />}
          variant={'outlined'}
          color={'success'}
          onClick={() => {
            handleOpenModal(true);
          }}
        >
          Create column
        </CreateColumnButton>
      </ColumnContainer>
      {openFormModal && (
        <FormModal open={openFormModal} setOpen={handleOpenModal} type={'column'} />
      )}
      {openConfirmModal && (
        <ConfirmationModal
          open={!!openConfirmModal}
          type={'column'}
          deleteValueId={openConfirmModal.id}
          deleteValueName={(openConfirmModal as ColumnResponseType).title}
          alertTitle={'Delete Column?'}
          setOpenConfirmModal={setOpenConfirmModal}
        />
      )}
    </RootContainer>
  );
}

export default BoardPage;
const RootContainer = styled.div`
  width: 90vw;
  margin: 0 auto;
  padding: 15px 0 80px 0;
  overflow-y: hidden;
  .MuiButton-textPrimary {
    position: absolute;
    left: 5px;
  }
`;
const BoardInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h2,
  h3 {
    font-weight: 300;
  }
  h3 {
    margin-bottom: 10px;
  }
`;
const ColumnContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0 20px 20px 20px;
  overflow-y: hidden;
  overflow-x: auto;
  ::-webkit-scrollbar {
    height: 7px;
  }
  ::-webkit-scrollbar-track {
    background: gray;
    border-radius: 20px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #3f51b5;
    border-radius: 20px;
  }
`;
const CreateColumnButton = styled(Button)`
  height: 70px;
  &.MuiButton-outlined {
    margin-left: 17px;
    min-width: 300px;
  }
`;
