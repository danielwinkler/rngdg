import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  ListRenderItemInfo,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface ITypeAHead {
  suggestion: string;
}

const renderListItem = (setSearch: (search: string) => void) => ({
  item,
  index,
}: ListRenderItemInfo<ITypeAHead>) => (
  <TouchableOpacity
    onPress={() => setSearch(item.suggestion)}
    style={styles.listItem}
    key={item.suggestion + index}>
    <Text>{item.suggestion}</Text>
  </TouchableOpacity>
);

const getSuggestions = async (query: string): Promise<ITypeAHead[]> => {
  const raw = await fetch(`https://api.datamuse.com/sug?s=${query}`);
  const res = (await raw.json()) as [{word: string}];
  return res.map(s => ({suggestion: s.word}));
};

const Home = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ITypeAHead[]>([]);
  useEffect(() => {
    getSuggestions(search).then(r => setResults(r));
  }, [search]);
  return (
    <>
      <TextInput
        style={styles.textInput}
        value={search}
        onChangeText={text => setSearch(text)}
        onSubmitEditing={() => console.log()}
        returnKeyType={'search'}
      />
      <FlatList
        data={results}
        renderItem={renderListItem(setSearch)}
        keyboardShouldPersistTaps={'handled'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {borderWidth: 1, paddingHorizontal: 10, margin: 5},
  listItem: {
    backgroundColor: 'gainsboro',
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 20,
  },
});

export {Home};
