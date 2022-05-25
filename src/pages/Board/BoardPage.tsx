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
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormModal from '../../components/ModalWindows/FormModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import { fetchBoard } from '../../BLL/reducers/board-reducer';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Column from './components/Column';
import { PATH } from '../AppRoutes';
import ConfirmationModal from '../../components/ModalWindows/ConfirmationModal';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { updateColumn } from '../../BLL/reducers/column-reducer';
import { TasksInitialStateType } from '../../BLL/reducers/tasks-reducers';

function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatchType>();
  const allTasks = useSelector<AppStateType, TasksInitialStateType>((state) => state.tasks);
  const board = useSelector<AppStateType, BoardType>((state) => state.boards.currentBoard);
  const allColumns = useSelector<AppStateType, Array<ColumnType>>((state) => state.columns.columns);
  const [columns, setColumns] = useState<Array<ColumnType>>([]);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = React.useState<
    ColumnResponseType | BoardResponseType | UserResponseType | null
  >(null);
  const [allTasksLocal, setAllTasksLocal] = useState<TasksInitialStateType>(allTasks);
  useEffect(() => {
    if (id) dispatch(fetchBoard(id));
  }, [id, dispatch]);
  useEffect(() => {
    setColumns(allColumns);
  }, [allColumns]);
  useEffect(() => {
    setAllTasksLocal(allTasks);
  }, []);
  const handleOpenModal = (isOpen: boolean) => {
    setOpenFormModal(isOpen);
  };
  const reorderColumnOnHover = (dragIndex: number, hoverIndex: number) => {
    setColumns((prevColumns: ColumnType[]) =>
      update(prevColumns, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevColumns[dragIndex]],
        ],
      })
    );
  };
  const moveColumnOnDrop = (dragIndex: number, hoverIndex: number, columnId: string) => {
    const column = allColumns.find((c) => c.id === columnId);
    if (column && (hoverIndex === 0 ? 1 : hoverIndex + 1) === column.order) return;
    if (id && column) {
      dispatch(
        updateColumn({
          boardId: id,
          columnId: columnId,
          title: column.title,
          order: hoverIndex === 0 ? 1 : hoverIndex + 1,
        })
      );
    }
  };
  const columnElements = columns.map((c, index) => {
    return (
      <Column
        key={c.id}
        index={index}
        columnId={c.id}
        title={c.title}
        order={c.order}
        allTasks={allTasksLocal}
        setAllTasksLocal={setAllTasksLocal}
        reorderColumnOnHover={reorderColumnOnHover}
        moveColumnOnDrop={moveColumnOnDrop}
        setOpenConfirmModal={setOpenConfirmModal}
      />
    );
  });
  // console.log('ren');
  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
}

export default BoardPage;
const RootContainer = styled.div`
  width: 90vw;
  height: 100%;
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
