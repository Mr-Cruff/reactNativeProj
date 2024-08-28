import React, {createContext, useState, useEffect} from 'react';
import {Alert} from 'react-native';
import ProcessQ from '../services/QueryQueue';

export const GlobalContext = createContext();

export const ContextProvider = ({children}) => {
  const AppStackInitialState = {
    token: 'gsdgsdfgsdfg',
    refreshToken: 'dgsdfgsdfgsdfgrr',
    formSchema: {}, // Form Schema: save a global state instance to the asyncstorage { formschema, farms }
    queries: [],
    currentQuery: '',
    internetAvailable: '',
    farms: [],
  };
  const [AppStackInfo, setAppStackInfo] = useState(AppStackInitialState);
  //  Todo: change setToken to update both token and refresh token, as well as authData token
  function setToken(token) {
    const newState = {...AppStackInfo, token};
    setAppStackInfo(newState);
  }
  function setRefreshToken(refreshToken) {
    const newState = {...AppStackInfo, refreshToken};
    setAppStackInfo(newState);
  }

  function addQuery(query) {
    const queries = [...AppStackInfo.queries, query];
    const newState = {...AppStackInfo, queries};
    setAppStackInfo(newState);
  }
  function setCurrentQuery(query) {
    const newState = {...AppStackInfo, currentQuery: query};
    setAppStackInfo(newState);
  }
  function setQueries(queries) {
    const newState = {...AppStackInfo, queries};
    setAppStackInfo(newState);
  }

  const [processingQ, setProcessingQ] = useState(false);

  const processQuery = async () => {
    if (!processingQ) {
      setProcessingQ(true);
    }
    let retry = false;
    const result = await ProcessQ(AppStackInfo.queries);
    if (result.length === 0) {
      setQueries([]);
      Alert.alert(`Alert`, `All queries from the queue have been sucessfully executed.`);
    } else {
      Alert.alert(
        `Error`,
        `These queries have failed on execution: ${result.map(
          i => `\n${i.error}:${i.query}`,
        )}, would you like to re-try?`,
        [
          {
            text: 'Try Again',
            onPress: () => {
              retry = true;
              console.log('Retry');
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
              setQueries([]);
              console.log('Cancel Pressed');
            },
            style: 'cancel',
          },
        ],
      );
    }

    if (retry) {
      const retryArr = result.map(i => [retryArr, ...i.query]);
      console.log(retryArr);
    }
  };

  function setFormSchema(formSchema) {
    const newState = {...AppStackInfo, formSchema};
    setAppStackInfo(newState);
  }

  function setFarms(farms) {
    const newState = {...AppStackInfo, farms};
    setAppStackInfo(newState);
  }

  function setInternetAvailable(internetAvailable) {
    const newState = {...AppStackInfo, internetAvailable};
    setAppStackInfo(newState);
  }

  const AppStackSetters = {
    setToken,
    setRefreshToken,
    setFormSchema,
    addQuery,
    setInternetAvailable,
    setFarms,
    processQuery,
  };

  return (
    <GlobalContext.Provider value={{...AppStackInfo, ...AppStackSetters}}>
      {children}
    </GlobalContext.Provider>
  );
};
