import { GET_TWEET } from '../actions/types';

const initialState = {
  tweets: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_TWEET:
      return {
        ...state,
        tweets: action.payload
      }
    default:
      return state;
  }
}