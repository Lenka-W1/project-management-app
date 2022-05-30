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
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { AppStatusType } from '../../BLL/reducers/app-reducer';
import Preloader from '../../components/Preloader/Preloader';

function MainPage() {
  const { t } = useTranslation();
  const boards = useSelector<AppStateType, Array<BoardResponseType>>(
    (state) => state.boards.boards
  );
  const appStatus = useSelector<AppStateType, AppStatusType>((state) => state.app.status);
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
        <Button
          variant={'text'}
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(PATH.WELCOME)}
        >
          {t('board_page.button_back')}
        </Button>
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
  justify-content: space-around;

  @media (max-width: 1000px) {
    justify-content: space-evenly;
  }

  @media (max-width: 777px) {
    flex-direction: column;

    h3 {
      margin-bottom: 10px;
    }
  }
`;

const RootContainer = styled.div`
  margin: 0 auto;
  max-width: 1920px;
  padding: 15px 0 80px;
  position: relative;
  .MuiButton-textPrimary {
    position: absolute;
    left: 5px;
  }

  @media (max-width: 688px) {
    padding: 15px 0 200px;
  }

  @media (max-width: 480px) {
    padding: 45px 0 200px;

    .MuiButton-textPrimary {
      left: 5px;
      top: 5px;
    }
  }
`;

const BoardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

const CreateBoardsButton = styled(Button)`
  height: 140px;
  width: 300px;
  &.MuiButton-outlined {
    margin: 17px;
  }
`;
