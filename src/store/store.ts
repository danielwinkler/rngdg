import { Reducer } from 'redux';
import _ from 'lodash';
import { ImageURISource } from 'react-native';

/// TYPES
export interface IState {
  query: string;
  images: { [term: string]: Array<ImageURISource> };
  alternatives: Array<string>;
}

const defaultState: IState = {
  query: '',
  images: {},
  alternatives: [],
};

/// ACTIONS
export enum ActionTypes {
  SET_QUERY = 'SET_QUERY',
  SET_IMAGES = 'SET_IMAGES',
  SET_ALTERNATIVES = 'SET_ALTERNATIVES',
}

export interface SetQueryAction {
  type: typeof ActionTypes.SET_QUERY;
  payload: { query: string };
}
export interface SetImagesAction {
  type: typeof ActionTypes.SET_IMAGES;
  payload: { query: string; images: ImageURISource[] };
}
export interface SetAlternativesAction {
  type: typeof ActionTypes.SET_ALTERNATIVES;
  payload: { alternatives: Array<string> };
}
export type Actions = SetQueryAction | SetImagesAction | SetAlternativesAction;

/// REDUCER
const reducer: Reducer<IState, Actions> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.SET_QUERY: {
      return { ...state, query: action.payload.query };
    }
    case ActionTypes.SET_IMAGES: {
      const { images, query } = action.payload;
      if (_.isEqual(images, state.images[query])) return state;
      return { ...state, images: { ...state.images, [query]: images } };
    }
    case ActionTypes.SET_ALTERNATIVES: {
      const { alternatives } = action.payload;
      if (_.isEqual(alternatives, state.alternatives)) return state;
      return { ...state, alternatives };
    }
    default:
      return state;
  }
};

export { reducer };
