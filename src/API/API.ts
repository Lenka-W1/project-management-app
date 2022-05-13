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

export const boardsAPI = {
  fetchAllBoards() {
    return instance.get<Array<BoardResponseType>>('boards');
  },
  createBoard(board: CreateBoardParamsType) {
    return instance.post<CreateBoardParamsType, AxiosResponse<BoardResponseType>>('boards', board);
  },
  fetchBoard(boardId: string) {
    return instance.get<AxiosResponse<BoardType>>(`boards/${boardId}`);
  },
  deleteBoard(boardId: string) {
    return instance.delete(`boards/${boardId}`);
  },
  updateBoard(boardId: string) {
    return instance.put<UpdateBoardParamsType, AxiosResponse<BoardResponseType>>(
      `boards/${boardId}`
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
  columns: [
    {
      id: string;
      title: string;
      order: number;
      tasks: [
        {
          id: string;
          title: string;
          order: 1;
          done: false;
          description: string;
          userId: string;
          files: [
            {
              filename: string;
              fileSize: number;
            }
          ];
        }
      ];
    }
  ];
};
export type UpdateBoardParamsType = {
  title: string;
  description: string;
};
