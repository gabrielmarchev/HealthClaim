import axios from 'axios';
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from './auth';

import {
  GET_CLAIMS,
  DELETE_CLAIM,
  ADD_CLAIM,
  GET_TWEETS,
  SEARCH_LOADING
} from './types';

// GET CLAIMS
export const getClaims = () => (dispatch, getState) => { //making asynch request with axios
  axios
    .get('/api/claims/', tokenConfig(getState)) //give promise back, also no web address infront because we're on localhost
    .then(res => { //gives response back
      dispatch({//dipsatch GET_LEADS action to reducer
        type: GET_CLAIMS,   //send type GET_CLAIMS to reducer, switch case evaluates action.type
        payload: res.data  //payload for reducer is claims returned from server, reducer's case GET_CLAIMS takes action.payload
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

// DELETE CLAIM
export const deleteClaim = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/claims/${id}`, tokenConfig(getState)) 
    .then(res => {
      dispatch(createMessage({ deleteClaim: "Health Claim Deleted" }));
      dispatch({
        type: DELETE_CLAIM,
        payload: id //pass id as payload
      }); 
    })
    .catch(err => console.log(err));
}

// ADD CLAIM
export const addClaim = (claim) => (dispatch, getState) => {
  axios
    .post('/api/claims/', claim, tokenConfig(getState)) 
    .then(res => {
      dispatch(createMessage({ addClaim: "Health Claim Searched" }));
      dispatch({
        type: ADD_CLAIM,
        payload: res.data
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

// GET_TWEETS - get list of tweets hashtagfrom hashtag search 
export const getTweets = (claim) => dispatch => {
  // Tweet search loading
  dispatch({ type: SEARCH_LOADING }); //sets isLoading true during processing of tweet search and analysis

  axios
    .get('http://localhost:8000/analyse', {
      params: {text: claim}
    })
    .then(res => {
      console.log(res)
      dispatch({
        type: GET_TWEETS,
        payload: res.data
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}