import { GET_CLAIMS, DELETE_CLAIM, ADD_CLAIM } from '../actions/types.js';

const initialState = {
  claims: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_CLAIMS:
      return {
        ...state,
        claims: action.payload
      }
    case DELETE_CLAIM:
      return {
        ...state,
        claims: state.claims.filter(claim => claim.id !== action.payload) //loop through claims in state to filter and return only ones that are NOT the deleted id
      }
    case ADD_CLAIM:
      return {
        ...state,
        claims: [...state.claims, action.payload]
      }
    default:
      return state;
  }
}