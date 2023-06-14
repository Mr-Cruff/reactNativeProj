import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { executeQuery } from '../services/Helpers'

const ProcessQ = async (q=[]) =>{
    const queries = [...q];
    const failedQ = [];
    const timesToRun = queries.length;
    for(let i=0; i<queries.length; i++){
        try{
            const queryResult = await executeQuery(queries[i]);
            console.log(queryResult.data);
        }catch(error){
            console.log("Query:  " +queries[i]+"\n"+"Error:  "+error.message);
            failedQ.push({query:queries[i], error:error.message});
        }
    }
    return failedQ;
}

export default ProcessQ;