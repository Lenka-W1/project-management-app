import axios, { AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: 'https://serene-ridge-35280.herokuapp.com/',
});

export const authAPI = {
  signIn(data: SignInParamsType) {
    return instance.post<SignInParamsType, AxiosResponse<{ token: string }>>('signin', data);
  },
  signUp(data: SignUpParamsType) {
    return instance.post<SignUpParamsType, AxiosResponse<SignUpResponseType>>('signup', data);
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
