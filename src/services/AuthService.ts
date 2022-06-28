export type AuthData = {
  token: string;
  email: string;
  name: string;
};

const signIn = (email, _password): Promise<AuthData> => {
  // this is a mock of an API call, in the real app
  // will need to connect with some real API,
  // send email and password, and if credential is corret
  //the API will resolve with some token and another datas as the below
  if (email == 'chris@jabgl.com' && _password == 'sim1') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          token: JWTTokenMock,
          email: email,
          name: 'Chris Williams',
        });
      }, 1000);
    });
  } else {
    return new Promise(reject => {
      setTimeout(() => {
        reject({
          token: '',
          email: '',
          name: '',
        });
      }, 1000);
    });
  }
};

export const authService = {
  signIn,
};

const JWTTokenMock =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikx1Y2FzIEdhcmNleiIsImlhdCI6MTUxNjIzOTAyMn0.oK5FZPULfF-nfZmiumDGiufxf10Fe2KiGe9G5Njoa64';
