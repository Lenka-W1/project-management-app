import axios, { AxiosResponse } from 'axios';
import { getToken } from '../utils/utils';

export const instance = axios.create({
  baseURL: 'https://lit-falls-11411.herokuapp.com/',
});

instance.interceptors.request.use(function (config) {
  const token = getToken('token', document.cookie);
  if (config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signIn(data: SignInParamsType) {
    return instance.post<SignInParamsType, AxiosResponse<{ token: string }>>('signin', data);
  },
  signUp(data: SignUpParamsType) {
    return instance.post<SignUpParamsType, AxiosResponse<SignUpResponseType>>('signup', data);
  },
};

export const userAPI = {
  fetchUser(id: string) {
    return instance.get<UserResponseType>(`users/${id}`);
  },
  updateUser(id: string, name: string, login: string, password: string) {
    return instance.put<UserParamsType, AxiosResponse<UserResponseType>>(`users/${id}`, {
      name,
      login,
      password,
    });
  },
  deleteUser(userId: string) {
    return instance.delete(`users/${userId}`);
  },
};

export const boardsAPI = {
  fetchAllBoards() {
    return instance.get<Array<BoardResponseType>>('boards');
  },
  createBoard(board: CreateBoardParamsType) {
    return instance.post<CreateBoardParamsType, AxiosResponse<BoardResponseType>>('boards', board);
  },
  fetchBoard(boardId: string) {
    return instance.get<BoardType>(`boards/${boardId}`);
  },
  deleteBoard(boardId: string) {
    return instance.delete(`boards/${boardId}`);
  },
  updateBoard(id: string, title: string, description: string) {
    return instance.put<UpdateBoardParamsType, AxiosResponse<BoardResponseType>>(`boards/${id}`, {
      title,
      description,
    });
  },
};

export const columnsAPI = {
  fetchAllColumns(boardId: string) {
    return instance.get<Array<ColumnResponseType>>(`boards/${boardId}/columns`);
  },
  createColumn(boardId: string, column: CreateColumnParamsType) {
    return instance.post<CreateColumnParamsType, AxiosResponse<ColumnResponseType>>(
      `boards/${boardId}/columns`,
      column
    );
  },
  fetchColumn(boardId: string, columnId: string) {
    return instance.get<AxiosResponse<ColumnType>>(`boards/${boardId}/columns/${columnId}`);
  },
  deleteColumn(boardId: string, columnId: string) {
    return instance.delete(`boards/${boardId}/columns/${columnId}`);
  },
  updateColumn(boardId: string, columnId: string, title: string, order: number) {
    return instance.put<{ title: string; order: number }, AxiosResponse<ColumnResponseType>>(
      `boards/${boardId}/columns/${columnId}`,
      {
        title,
        order,
      }
    );
  },
};

export const tasksAPI = {
  fetchAllTasks(boardId: string, columnId: string) {
    return instance.get<Array<TaskResponseType>>(`boards/${boardId}/columns/${columnId}/tasks`);
  },
  createTask(boardId: string, columnId: string, task: CreateTaskParamsType) {
    return instance.post<CreateTaskParamsType, AxiosResponse<TaskResponseType>>(
      `boards/${boardId}/columns/${columnId}/tasks`,
      task
    );
  },
  fetchTask(boardId: string, columnId: string, taskId: string) {
    return instance.get<AxiosResponse<TaskResponseType>>(
      `boards/${boardId}/columns/${columnId}/tasks/${taskId}`
    );
  },
  deleteTask(boardId: string, columnId: string, taskId: string) {
    return instance.delete(`boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
  },
  updateTask(boardId: string, columnId: string, taskId: string, params: UpdateTaskParamsType) {
    return instance.put<{ title: string; order: number }, AxiosResponse<TaskResponseType>>(
      `boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
      params
    );
  },
};

export type SignInParamsType = {
  login: string;
  password: string;
};
export type SignUpParamsType = {
  name: string;
  login: string;
  password: string;
};
export type SignUpResponseType = {
  id: string;
  name: string;
  login: string;
};

export type BoardResponseType = {
  id: string;
  title: string;
  description: string;
};
export type CreateBoardParamsType = {
  title: string;
  description: string;
};
export type BoardType = {
  id: string;
  title: string;
  description: string;
  columns: Array<ColumnType>;
};
export type UpdateBoardParamsType = BoardResponseType;

export type ColumnResponseType = {
  id: string;
  title: string;
  order: number;
};
export type CreateColumnParamsType = {
  title: string;
};
export type ColumnType = {
  id: string;
  title: string;
  order: number;
  tasks: Array<TaskType>;
};

export type UserParamsType = {
  name: string;
  login: string;
  password: string;
};
export type UserResponseType = {
  id: string;
  name: string;
  login: string;
};

export type TaskResponseType = {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
  files: [
    {
      filename: string;
      fileSize: number;
    }
  ];
};
export type TaskType = {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  files: [
    {
      filename: string;
      fileSize: number;
    }
  ];
};
export type CreateTaskParamsType = {
  title: string;
  description: string;
  userId: string;
};
export type UpdateTaskParamsType = {
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
};

export type TokenType = {
  userId: string;
  login: string;
  iat: string;
};
