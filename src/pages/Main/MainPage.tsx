import React, { useEffect, useState } from 'react';
import { BoardResponseType } from '../../API/API';
import { Button, InputAdornment, TextField } from '@mui/material';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import BoardCard from './components/BoardCard';
import FormModal from '../../components/ModalWindows/FormModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import { fetchAllBoards } from '../../BLL/reducers/board-reducer';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../AppRoutes';
import ConfirmationModal from '../../components/ModalWindows/confirmationModal';

function MainPage() {
  const boards = useSelector<AppStateType, Array<BoardResponseType>>(
    (state) => state.boards.boards
  );
  const isLoggedIn = useSelector<AppStateType, boolean>((state) => state.auth.isLoggedIn);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = React.useState<BoardResponseType | null>(null);
  const dispatch = useDispatch<AppDispatchType>();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllBoards());
  }, [dispatch, boards.length]);
  useEffect(() => {
    if (!isLoggedIn) navigate(PATH.SIGN_IN);
  }, [isLoggedIn, navigate]);
  const handleOpenModal = (isOpen: boolean) => {
    setOpenFormModal(isOpen);
  };
  const boardElements = boards.map((b) => {
    return (
      <BoardCard
        key={b.id}
        id={b.id}
        title={b.title}
        description={b.description}
        setOpenConfirmModal={setOpenConfirmModal}
      />
    );
  });

  return (
    <RootContainer>
      <MainHeader>
        <h3>Boards shown: 2 of 2</h3>
        <div>
          <TextField
            id="input-with-icon-textfield"
            label="Search"
            size={'small'}
            placeholder={'Search board'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </MainHeader>
      <BoardsContainer>
        <CreateBoardsButton variant={'outlined'} onClick={() => handleOpenModal(true)}>
          Create a new Board
        </CreateBoardsButton>
        {boardElements}
      </BoardsContainer>
      {openFormModal && <FormModal open={openFormModal} setOpen={handleOpenModal} />}
      {openConfirmModal && (
        <ConfirmationModal
          open={!!openConfirmModal}
          type={'board'}
          deleteValueId={openConfirmModal.id}
          deleteValueName={openConfirmModal.title}
          alertTitle={'Delete Board?'}
          setOpenConfirmModal={setOpenConfirmModal}
        />
      )}
    </RootContainer>
  );
}

export default MainPage;

const MainHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const RootContainer = styled.div`
  width: 80vw;
  margin: 0 auto;
  padding: 15px 0 15px 0;
`;
const BoardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  margin-left: 30px;
`;
const CreateBoardsButton = styled(Button)`
  height: 140px;
  width: 300px;
  &.MuiButton-outlined {
    margin: 17px;
  }
`;
