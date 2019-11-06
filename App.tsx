/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  ListRenderItemInfo,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';

interface ITypeAHead {
  suggestion: string;
}

const Header = () => <Text>Suggestions:</Text>;


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

const getTypeAhead = async (query: string): Promise<ITypeAHead[]> => {
  const raw = await fetch(`https://api.datamuse.com/sug?s=${query}`);
  const res = (await raw.json()) as [{ word: string }];
  return res.map(s => ({ suggestion: s.word }));
};

const App = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ITypeAHead[]>([]);
  useEffect(() => {
    getTypeAhead(search).then(r => setResults(r));
  }, [search]);
  return (
    <>
      <TextInput
        style={styles.textInput}
        value={search}
        onChangeText={text => setSearch(text)}
        returnKeyType={'search'}
      />
      <FlatList
        ListHeaderComponent={<Header />}
        data={results}
        renderItem={renderListItem(setSearch)}
        keyboardShouldPersistTaps={'handled'}
      />
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

export default App;
