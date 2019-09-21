import redux, { IAction, IReducers } from '../framework'
import { registerActions } from './helpers'


export interface IQiniuState {
  token: S
  url: S
  syncToken: S
}

export type IQiniuAction = IAction<'SET_QINIU_TOKEN', S>
                          | IAction<'SET_QINIU_SYNC_TOKEN', S>

const actionTypes = [ 'SET_QINIU_TOKEN'
                    , 'SET_QINIU_SYNC_TOKEN' ] as const

const ActionTypes = registerActions(actionTypes, 'global')

const reducers: IReducers<IQiniuState, Resolved<IQiniuAction>> = {
  token (state: S, action: IAction) {
    if (action.type === ActionTypes.SET_QINIU_TOKEN) return action.payload
    return state
  },

  syncToken (state: S, action: IAction) {
    if (action.type === ActionTypes.SET_QINIU_SYNC_TOKEN) return action.payload
    return state
  },

  url (state: S, action: IAction) {
    return state
  },
}

const reducer = redux.combineReducers(reducers)

export default {
  ActionTypes,
  reducer,
}
