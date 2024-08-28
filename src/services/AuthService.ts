import axios from 'axios';
import jwt_decode from 'jwt-decode';
import alert_LoginFailed from '../components/LoginFailed_Alert';
import {AUTH_API, APP_ID} from '../Constants';
import {isObjectEmpty} from './Helpers';

export type AuthData = {
  uuid: string;
  token: string;
  email: string;
  name: string;
  password: string;
  role: string;
  refreshToken: string;
  firstLogon?: number;
};

const signIn = async (email: string, _password: string): Promise<AuthData> => {
  let decoded: any = {};
  let name = '';
  let role = '';
  let uuid = '';
  let data: any = {};

  try {
    const response = await axios.post(`${AUTH_API}/api/Auth/login`, {
      username: email,
      password: _password,
      appID: APP_ID,
    });

    data = response.data;
    decoded = jwt_decode(data.token);

    // Extract name, role, and uuid from decoded token
    Object.keys(decoded).forEach(item => {
      if (item.endsWith('name')) name = decoded[item];
      if (item.endsWith('role')) role = decoded[item];
      if (item.endsWith('nameidentifier')) uuid = decoded[item];
    });

    // Check for success response
    if (data.success) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            uuid: uuid,
            token: data.token || '',
            email: email,
            name: name,
            password: data.firstLogon === 1 ? _password : '',
            role: role,
            refreshToken: data.refreshToken || '',
            firstLogon: data.firstLogon || 0,
          });
        }, 1000);
      });
    } else {
      alert_LoginFailed(data);
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Promise(reject => {
      setTimeout(() => {
        reject({
          uuid: '',
          token: '',
          email: '',
          name: '',
          password: '',
          role: '',
          refreshToken: '',
        });
      }, 1000);
    });
  }
};

export const authService = {
  signIn,
};

export const tokenValidation = (token: string) => {
  const decoded: any = jwt_decode(token);
  const date = Date.now();
  if (decoded.exp * 1000 >= date) {
    return true;
  }
  return false;
};
