import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  ListRenderItemInfo,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { IState, ActionTypes, Actions } from '../store/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import HGifPane from './HGifPane';

interface ITypeAHead {
  suggestion: string;
}

const renderListItem = (select: (search: string) => void) => ({
  item,
  index,
}: ListRenderItemInfo<ITypeAHead>) => (
    <TouchableOpacity
      onPress={() => select(item.suggestion)}
      style={styles.listItem}
      key={item.suggestion + index}>
      <Text>{item.suggestion}</Text>
    </TouchableOpacity>
  );

const getSuggestions = async (query: string): Promise<ITypeAHead[]> => {
  const raw = await fetch(`https://api.datamuse.com/sug?s=${query}`);
  const res = (await raw.json()) as [{ word: string }];
  return res.map(s => ({ suggestion: s.word }));
};

interface PropsFromState {
  showGifs: boolean;
  terms: Array<string>;
}

interface PropsFromDispatch {
  searchGifs: (search: string) => void;
}

type Props = PropsFromState & PropsFromDispatch;

const Home = (props: Props) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ITypeAHead[]>([]);
  useEffect(() => {
    getSuggestions(search).then(r => setResults(r));
  }, [search]);
  const selectAndSearch = (search: string) => {
    setSearch(search);
    props.searchGifs(search);
  };
  return (
    <>
      <TextInput
        style={styles.textInput}
        value={search}
        onChangeText={text => setSearch(text)}
        onSubmitEditing={() => props.searchGifs(search)}
        returnKeyType={'search'}
      />
      {props.showGifs ? (
        <FlatList
          data={props.terms}
          renderItem={({ item }) => <HGifPane term={item} />}
        />
      ) : (
          <FlatList
            data={results}
            renderItem={renderListItem(selectAndSearch)}
            keyboardShouldPersistTaps={'handled'}
          />
        )}
    </>
  );
};

const styles = StyleSheet.create({
  textInput: { borderWidth: 1, paddingHorizontal: 10, margin: 5 },
  listItem: {
    backgroundColor: 'gainsboro',
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 20,
  },
});

const mapStateToProps = (state: IState): PropsFromState => ({
  showGifs: !!state.query,
  terms: state.alternatives || [],
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): PropsFromDispatch => ({
  searchGifs: search =>
    dispatch({ type: ActionTypes.SET_QUERY, payload: { query: search } }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
