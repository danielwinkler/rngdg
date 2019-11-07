import { ActionTypes, Actions, SetImagesAction, SetQueryAction, SetAlternativesAction, IState } from './store';
import { Epic, ofType } from 'redux-observable';
import { mergeMap, map, startWith, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Gifs } from '../services/giphyclient';
import { Gif } from '../services/api/giphy';
import { from } from 'rxjs';
import { ImageURISource } from 'react-native';
import { keysToCamelHackForSwagger } from '../util';

const parseDtoToGif = (dto: Array<Gif>): Array<ImageURISource> =>
  dto
    .map(keysToCamelHackForSwagger) // hack: types and data do not match because of swagger-codegen
    .map(gif => ({ uri: gif.images?.fixedHeightSmall?.webp }))
    .filter(gif => gif.uri);

const loadGifsForQuery = (query: string) =>
  from(Gifs.searchGifs(query)).pipe(
    map(r => parseDtoToGif(r.data!)),
    map<Array<ImageURISource>, SetImagesAction>(gifs => ({
      type: ActionTypes.SET_IMAGES,
      payload: { images: gifs, query: query },
    })),
  );

export const loadGifsEpic: Epic<Actions> = action$ =>
  action$.pipe(
    ofType<Actions, SetQueryAction>(ActionTypes.SET_QUERY),
    mergeMap(action => loadGifsForQuery(action.payload.query)),
  );

export const loadAlternativesEpic: Epic<Actions> = action$ =>
  action$.pipe(
    ofType<Actions, SetQueryAction>(ActionTypes.SET_QUERY),
    mergeMap(action =>
      from(
        fetch(`https://api.datamuse.com/words?rel_trg=${action.payload.query}`),
      ).pipe(
        mergeMap(r => r.json()),
        map((triggers: [{ word: string }]) =>
          triggers.slice(0, 5).map(t => t.word),
        ),
        map<Array<string>, SetAlternativesAction>(as => ({
          type: ActionTypes.SET_ALTERNATIVES,
          payload: { alternatives: [action.payload.query, ...as] },
        })),
        startWith<SetAlternativesAction>({
          type: ActionTypes.SET_ALTERNATIVES,
          payload: { alternatives: [action.payload.query] },
        }),
      ),
    ),
  );

export const loadAlternativeGifsEpic: Epic<Actions, Actions, IState> = (
  action$,
  state$,
) =>
  action$.pipe(
    ofType<Actions, SetAlternativesAction>(ActionTypes.SET_ALTERNATIVES),
    mergeMap(action => action.payload.alternatives),
    withLatestFrom(state$),
    filter(([a, s]) => !s.images[a]),
    mergeMap(([a, _]) => loadGifsForQuery(a)),
  );
