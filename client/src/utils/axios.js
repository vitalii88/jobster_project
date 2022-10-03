import axios from 'axios';
import { clearStore } from '../features/user/userSlice';
import { getUserFromLocalStorage } from './localStorage';

const backendURL = process.env.REACT_APP_SERVER_BASE_URL;

const customFetch = axios.create({
  baseURL: `${backendURL}/api/v1`,
});

customFetch.interceptors.request.use((config) => {
  const user = getUserFromLocalStorage();
  if (user) {
    config.headers.common['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
});

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response.status === 401) {
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
  }
  return thunkAPI.rejectWithValue(error.response.data.msg);
};

export default customFetch;
