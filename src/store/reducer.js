import { combineReducers } from 'redux'

const routeWhiteList = ['首页权限']

const MenuReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_OPENKEYS':
      return action.openKeys
    default:
      return state
  }
}
const authReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_AUTHARR':
      return routeWhiteList.concat(action.authArr)
    default:
      return state
  }
}
const visitedViewsReducer = (
  state = [
    {
      routeName: '首页',
      path: '/Dashboard'
    }
  ],
  action
) => {
  switch (action.type) {
    case 'ADD_VISITIEDVIEWS':
      const isHave = state.find((v) => v.path === action.visitedObj.path)
      if (isHave === undefined) {
        return state.concat(action.visitedObj)
      } else {
        isHave.state = action.visitedObj.state
        return state
      }
    case 'REMOVE_VISITIEDVIEWS':
      return state.filter((v) => v.path !== action.visitedObj.path)
    default:
      return state
  }
}
const allReducers = combineReducers({
  Menu: MenuReducer,
  auth: authReducer,
  visitiedViews: visitedViewsReducer
})
export default allReducers
