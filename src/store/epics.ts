import { ActionTypes, Actions, SetImagesAction, SetQueryAction } from './store';
import { Epic, ofType } from 'redux-observable';
import { mergeMap, map } from 'rxjs/operators';
import { Gifs } from '../services/giphyclient';
import { Gif } from '../services/api/giphy';
import { from } from 'rxjs';
import { ImageURISource } from 'react-native';

const parseDtoToGif = (dto: Array<Gif>): Array<ImageURISource> =>
  dto
    .map(gif => ({ uri: gif.images?.original?.url }))
    .filter(gif => gif.uri);

const loadGifsEpic: Epic<Actions> = action$ =>
  action$.pipe(
    ofType<Actions, SetQueryAction>(ActionTypes.SET_QUERY),
    mergeMap(action =>
      from(Gifs.searchGifs(action.payload.query)).pipe(
        map(r => parseDtoToGif(r.data!)),
        // that stupid cast is not necessary when you use typesafe actions
        map<Array<ImageURISource>, SetImagesAction>(images => ({
          type: ActionTypes.SET_IMAGES,
          payload: { images },
        })),
      ),
    ),
  );

export { loadGifsEpic };
