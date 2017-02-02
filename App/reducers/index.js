'use strict'


 import { combineReducers } from 'redux'


import global from './global/globalReducer'


 const rootReducer = combineReducers({
    global
 })

 export default rootReducer
