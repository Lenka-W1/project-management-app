import React, { useEffect, useState } from 'react';
import { BoardResponseType, ColumnResponseType, UserResponseType } from '../../API/API';
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
import ConfirmationModal from '../../components/ModalWindows/ConfirmationModal';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

function MainPage() {
  const { t } = useTranslation();
  const boards = useSelector<AppStateType, Array<BoardResponseType>>(
    (state) => state.boards.boards
  );
  const isLoggedIn = useSelector<AppStateType, boolean>((state) => state.auth.isLoggedIn);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = React.useState<
    BoardResponseType | ColumnResponseType | UserResponseType | null
  >(null);
  const [searchBoardName, setSearchBoardName] = useState('');
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
  const searchBoardHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchBoardName(e.currentTarget.value);
  };
  const boardElements = boards
    .map((b) => (
      <BoardCard
        key={b.id}
        id={b.id}
        title={b.title}
        description={b.description}
        setOpenConfirmModal={setOpenConfirmModal}
      />
    ))
    .filter((b) => b.props.title.toLowerCase().includes(searchBoardName.toLowerCase()));

  return (
    <RootContainer>
      <MainHeader>
        <h3>
          {t('main_page.boards_shown')}{' '}
          {
            boards.filter((b) => b.title.toLowerCase().includes(searchBoardName.toLowerCase()))
              .length
          }{' '}
          {t('main_page.of')} {boards.length}
        </h3>
        <div>
          <TextField
            id="input-with-icon-textfield"
            label={t('main_page.search')}
            size={'small'}
            placeholder={t('main_page.search_board')}
            value={searchBoardName}
            onChange={(e) => {
              searchBoardHandler(e);
            }}
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
        <CreateBoardsButton
          variant={'outlined'}
          color={'success'}
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal(true)}
        >
          {t('main_page.create_new_board')}
        </CreateBoardsButton>
        {boardElements}
      </BoardsContainer>
      {openFormModal && <FormModal open={openFormModal} setOpen={handleOpenModal} type={'board'} />}
      {openConfirmModal && (
        <ConfirmationModal
          open={!!openConfirmModal}
          type={'board'}
          deleteValueId={openConfirmModal.id}
          deleteValueName={(openConfirmModal as BoardResponseType).title}
          alertTitle={t('main_page.modal_window.alert_title')}
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
  padding: 15px 0 80px 0;
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
