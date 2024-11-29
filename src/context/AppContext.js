import React, { createContext, useReducer } from 'react';

const initialState = {
  query: '',
  input: '',
  pages: { previous: 1, current: 1 },
  searchResultsAll: [],
  searchResultsDisplayData: [],
  filters: {},
  sortBy: 'Title',
  isReversed: false,
  isFilterFormOpen: false,
  isAddingAllResultsModalOpen: false,
  watched: [],
  isReversedWatched: false,
  isFilterFormOpenWatched: false,
};

const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'SET_PAGES':
      return { ...state, pages: action.payload };
    case 'SET_SEARCH_RESULTS_ALL':
      return { ...state, searchResultsAll: action.payload };
    case 'SET_SEARCH_RESULTS_DISPLAY_DATA':
      return { ...state, searchResultsDisplayData: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_IS_REVERSED':
      return { ...state, isReversed: action.payload };
    case 'SET_IS_FILTER_FORM_OPEN':
      return { ...state, isFilterFormOpen: action.payload };
    case 'SET_IS_ADDING_ALL_RESULTS_MODAL_OPEN':
      return {
        ...state,
        isAddingAllResultsModalOpen: action.payload,
      };
    case 'SET_WATCHED':
      return { ...state, watched: action.payload };
    case 'SET_IS_REVERSED_WATCHED':
      return { ...state, isReversedWatched: action.payload };
    case 'SET_IS_FILTER_FORM_OPEN_WATCHED':
      return { ...state, isFilterFormOpenWatched: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
