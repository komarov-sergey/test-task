import {createContext, useReducer} from 'react'

const initialState = {
  isLoggedIn: false,
  currentUser: null,
  tasks: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHORIZED':
      return {
        ...state,
        isLoggedIn: true,
        currentUser: action.payload,
      }
    case 'SET_UNAUTHORIZED':
      return {
        ...state,
        isLoggedIn: false,
        currentUser: null,
      }
    default:
      return state
  }
}

export const CurrentUserContext = createContext()

export const CurrentUserProvider = ({children}) => {
  const value = useReducer(reducer, initialState)
  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  )
}
