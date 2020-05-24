import { GET_TWEETS, SEARCH_LOADING } from '../actions/types';

const initialState= {
  isSearched: false,
  isLoading: false,
  results: {},
  tweets: {}
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SEARCH_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case GET_TWEETS:
      return {
        ...state,
        isSearched: true,
        isLoading: false,
        results: action.payload.results,
        tweets: action.payload.sampleTweets
      };
    default:
      return state;
  }
}