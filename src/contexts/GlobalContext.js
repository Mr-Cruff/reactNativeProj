import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { executeQuery } from '../services/Helpers';
import ProcessQ from '../services/QueryQueue';
import { tokenValidation } from '../services/AuthService';
import { useAuth } from './Auth';

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const AppStackInitialState = {
    token: 'gsdgsdfgsdfg',
    refreshToken: 'dgsdfgsdfgsdfgrr',
    formSchema:{},    // Form Schema: save a global state instance to the asyncstorage { formschema, farms }
    queries: [],
    currentQuery: '',
    internetAvailable: '',
    farms:[],
  }
  const [AppStackInfo, setAppStackInfo] = useState(AppStackInitialState);
//  Todo: change setToken to update both token and refresh token, as well as authData token
  function setToken(token) {
    const newState = { ...AppStackInfo, token };
    setAppStackInfo(newState);
  }
  function setRefreshToken(refreshToken) {
    const newState = { ...AppStackInfo, refreshToken };
    setAppStackInfo(newState);
  }

  function addQuery(query) {
      const queries = [ ...AppStackInfo.queries, query ];
      const newState = { ...AppStackInfo, queries };
      setAppStackInfo(newState);
  }
  function setCurrentQuery(query) {
      const newState = { ...AppStackInfo, currentQuery:query };
      setAppStackInfo(newState);
  }
  function setQueries(queries) {
    const newState = { ...AppStackInfo, queries };
    setAppStackInfo(newState);
  }

  const [processingQ, setProcessingQ] = useState(false);
  // useEffect(()=>{
  //   // console.log('Use Effect =========== ');
  //   if (!AppStackInfo.internetAvailable) {
  //     // console.log('No Internet; returning...');
  //     return;
  //   }
  //   // if (AppStackInfo.queries.length > 0 && !processingQ) {

  //   // }
  // },[AppStackInfo.internetAvailable],processingQ)

  // const processQuery = async () => {
  //   if (!processingQ) {
  //     return;
  //   }
  //   console.log('Process Queue =======================');
  //   // console.log('Process Queue =======================' + AppStackInfo.queries.length);
  //   if (!AppStackInfo.internetAvailable) {
  //     console.log('No Internet; returning...');
  //     setProcessingQ(false);
  //     return;
  //   }
  //   if (AppStackInfo.queries.length === 0) {
  //     setProcessingQ(false);
  //     console.log('No more queries to process; returning...');
  //     return;
  //   }
  //   console.log('running process query . . .');
  //   const { queries } = AppStackInfo;
  //   const [firstQuery, ...rest] = queries;

  //   // setCurrentQuery(queries[0]);
  //   console.log('first query:   '+firstQuery);
  //   setCurrentQuery(firstQuery);
  //   setQueries(rest);
  //   Alert.alert(`Currently executing: ${firstQuery}`,`There are ${rest.length} requests remaining.`);

  //   // Perform the query and update the result
  //   try{
  //     const result = await executeQuery(firstQuery);
  //     console.log(result.data)

  //   }catch(err){
  //     // setQueries([...queries, AppStackInfo.currentQuery]);
  //     alert(`Query '${AppStackInfo.currentQuery}' failed: ${err.message}`);
  //   }
  //   // ...
  //   console.log("current:   "+AppStackInfo.currentQuery);
  //   console.log("queries:   "+!AppStackInfo.queries.length);

  //   // Call processQuery again to process the next query in the queue
  //   if (rest.length === 0) {
  //     setProcessingQ(false);
  //     console.log('No more queries to process; returning...');
  //     return;
  //   }else{
  //     processQuery();
  //   }
    
  // }
  const processQuery = async () => {
    if (!processingQ) {
      setProcessingQ(true);
    }
    let retry=false;
    const result = await ProcessQ(AppStackInfo.queries);
    if (result.length === 0){
      setQueries([]);
      Alert.alert(`Alert`,`All queries from the queue have been sucessfully executed.`);
    }else{
      Alert.alert(`Error`,`These queries have failed on execution: ${result.map((i)=>`\n${i.error}:${i.query}`)}, would you like to re-try?`,
      [
        {
          text: 'Try Again',
          onPress: () => {retry = true; console.log('Retry')},
        },
        {
          text: 'Cancel',
          onPress: () => {setQueries([]); console.log('Cancel Pressed')},
          style: 'cancel',
        },
      ]);
    }

    if (retry){
      const retryArr = result.map((i)=>[retryArr, ...i.query]);
      console.log(retryArr);
      // const retryResult = await ProcessQ(result);
    }
  }

  function setFormSchema(formSchema) {
    const newState = { ...AppStackInfo, formSchema };
    setAppStackInfo(newState);
  }

  function setFarms(farms) {
    const newState = { ...AppStackInfo, farms };
    setAppStackInfo(newState);
  }

// [`${APP_API}/api/Farm/getFarmByOwner?id=${auth.authData.uuid}`,undefined,undefined,undefined]

  function setInternetAvailable(internetAvailable) {
    const newState = { ...AppStackInfo, internetAvailable };
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
  }

  // const auth = useAuth();
  // // console.log('Yo I\'m running Now');
  // useEffect(()=>{
  //   console.log('validating . . . ')
  //   console.log(auth.authData?.token);
  //   if (!tokenValidation(auth.authData?.token))
  //   //  auth.signOut();
  //   console.log('sign out . . .'); 
  // });
  return (
    <GlobalContext.Provider value={{ ...AppStackInfo, ...AppStackSetters }}>
      {children}
    </GlobalContext.Provider>
  );
};