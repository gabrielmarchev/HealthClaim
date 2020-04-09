import axios from 'axios';

import { GET_CLAIMS, DELETE_CLAIM, ADD_CLAIM } from './types';

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

//ADD CLAIM
export const addClaim = (claim) => dispatch => {
  axios
    .post('/api/claims/', claim) 
    .then(res => {
      dispatch({
        type: ADD_CLAIM,
        payload: res.data
      }); 
    })
    .catch(err => console.log(err));
}
