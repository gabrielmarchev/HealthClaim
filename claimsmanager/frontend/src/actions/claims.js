import axios from 'axios';

import { GET_CLAIMS, DELETE_CLAIM, ADD_CLAIM, GET_ERRORS, GET_TWEET } from './types';

// GET CLAIMS
export const getClaims = () => dispatch => { //making asynch request with axios
  axios
    .get('/api/claims/') //give promise back, also no web address infront because we're on localhost
    .then(res => { //gives response back
      dispatch({//dipsatch GET_LEADS action to reducer
        type: GET_CLAIMS,   //send type GET_CLAIMS to reducer, switch case evaluates action.type
        payload: res.data  //payload for reducer is claims returned from server, reducer's case GET_CLAIMS takes action.payload
      });
    })
    .catch(err => console.log(err));
}

// DELETE CLAIM
export const deleteClaim = (id) => dispatch => {
  axios
    .delete(`/api/claims/${id}`) 
    .then(res => {
      dispatch({
        type: DELETE_CLAIM,
        payload: id //pass id as payload
      }); 
    })
    .catch(err => console.log(err));
}

// ADD CLAIM
export const addClaim = (claim) => dispatch => {
  axios
    .post('/api/claims/', claim) 
    .then(res => {
      dispatch({
        type: ADD_CLAIM,
        payload: res.data
      });
    })
    .catch(err => {
      const errors = {
        msg: err.response.data,
        status: err.response.status
      }
      dispatch({
        type: GET_ERRORS,
        payload: errors
      })
    });
}

// GET_TWEETS - get list of tweets from hashtag search 
export const getTweets = (hashtag) => dispatch => {
  axios
    .get('http://localhost:8000/twitter_search', {
      params: {text: hashtag}
    })
    .then(res => {
      //response = res.toObject();
      console.log(res.data.results); //check if python method returns corpus of tweets
      //const results = Array.from(res.data.results);
      dispatch({
        type: GET_TWEET,
        payload: res.data.results
      });
    })
    .catch(err => console.log(err));
}