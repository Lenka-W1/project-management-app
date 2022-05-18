import axios, { AxiosResponse } from 'axios';

export const instance = axios.create({
  baseURL: 'https://serene-ridge-35280.herokuapp.com/',
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
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
  fetchAllUsers() {
    return instance.get<Array<UserResponseType>>('users');
  },
  updateUser(id: string, name: string, login: string, password?: string) {
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

console.log(userAPI.fetchAllUsers());

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
  order: number;
};
export type ColumnType = {
  id: string;
  title: string;
  order: number;
  tasks: Array<TaskType>;
};
export type TaskType = {
  id: string;
  title: string;
  order: number;
  done: boolean;
  description: string;
  userId: string;
  files: [
    {
      filename: string;
      fileSize: number;
    }
  ];
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
