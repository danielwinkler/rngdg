import { Reducer } from 'redux';
import _ from 'lodash';
import { ImageURISource } from 'react-native';

/// TYPES
interface IState {
  query: string;
  images: Array<ImageURISource>;
}

const defaultState: IState = {
  query: '',
  images: [],
};

/// ACTIONS
export enum ActionTypes {
  SET_QUERY = 'SET_QUERY',
  SET_IMAGES = 'SET_IMAGES',
}

interface SetQueryAction {
  type: typeof ActionTypes.SET_QUERY;
  payload: { query: string };
}
interface SetImagesAction {
  type: typeof ActionTypes.SET_IMAGES;
  payload: { images: Array<ImageURISource> };
}
type Actions = SetQueryAction | SetImagesAction;

/// REDUCER
const reducer: Reducer<IState, Actions> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.SET_QUERY: {
      return { ...state, query: action.payload.query };
    }
    case ActionTypes.SET_IMAGES: {
      const { images } = action.payload;
      if (_.isEqual(images, state.images)) return state;
      return { ...state, images };
    }
    default:
      return state;
  }
};

export { reducer as Store };
