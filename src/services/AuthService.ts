import axios from 'axios';
import jwt_decode from 'jwt-decode';
import alert_LoginFailed from '../components/LoginFailed_Alert';
import { AUTH_API, APP_ID } from '../Constants';
import { isObjectEmpty } from './Helpers';

export type AuthData = {
  uuid:string;
  token: string;
  email: string;
  name: string;
  password:string;
  role:string;
  refreshToken:string;
  firstLogon?:number;
};

const signIn = async (email, _password): Promise<AuthData> => {
  // this is a mock of an API call, in the real app
  // will need to connect with some real API,
  // send email and password, and if credential is corret
  //the API will resolve with some token and another datas as the below

  let decoded ="";let name="";let data:any={};let role="";let uuid:"";

  await axios.post(`${AUTH_API}/api/Auth/login`, {"username":email,"password":_password, "appID":APP_ID}).then(res=>{
    data = res.data;
    decoded = jwt_decode(data.token);
    name="";
    
    Object.keys(decoded).map((item) => {
      item.endsWith('name') ? name = decoded[item] : '';
      item.endsWith('role') ? role = decoded[item] : '';
      item.endsWith('nameidentifier') ? uuid = decoded[item] : '';
    });
  }).catch(res =>{
    data = isObjectEmpty(data)? res: data;
  });
  
  if (data.success) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          uuid:uuid,
          token: data.token || '',
          email: email,
          name: name,
          password: data.firstLogon === 1 ?_password:"",
          role: role,
          refreshToken: data.refreshToken || '',
          firstLogon: data.firstLogon || 0,
        },);
      }, 1000);
    });
  } else {
    alert_LoginFailed(data);
    return new Promise(reject => {
      setTimeout(() => {
        reject({
          token: '',
          email: '',
          name: '',
          password: '',
          role:'',
          uuid:'',
          refreshToken:'',
        });
      }, 1000);
    });
  }
};

export const authService = {
  signIn,
};

export const tokenValidation = (token:string) => {
  const decoded:any = jwt_decode(token);
  const decoded1:any = jwt_decode("eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjVhMDU1YzFiLTYyYmQtNDM4ZS00MjQyLTA4ZGE5NmQzMzk0ZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJMZW9uIEJyb3duIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3lzdGVtIEFkbWluaXN0cmF0b3IiLCJleHAiOjE2ODYzMjE4NDl9.uj9ukqy6sUGDQfbzkKkRQtJrFenmUHsk45lL9ofbynr6lsKwfHAYK_cu6PwKTwgot0A2NEg0O0z_Tv9lz_0RSA");
  const date = Date.now();
  if(decoded.exp *1000 >= date){
    return true;
  }
  return false;
}

// export const setCredentialds = () =>{
//   authData
// }
