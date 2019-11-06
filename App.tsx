/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListRenderItemInfo,
  TextInput,
  FlatList,
} from 'react-native';

interface ITypeAHead {
  suggestion: string;
}

const Header = () => <Text>Suggestions:</Text>;

const renderListItem = ({ item, index }: ListRenderItemInfo<ITypeAHead>) => (
  <View style={styles.listItem} key={item.suggestion + index}>
    <Text>{item.suggestion}</Text>
  </View>
);

const App = () => {
  const [search, setSearch] = useState('');
  return (
    <>
      <TextInput
        style={styles.textInput}
        value={search}
        onChangeText={text => setSearch(text)}
        onSubmitEditing={_ => console.log(`search for ${search}`)}
        returnKeyType={'search'}
      />
      <FlatList
        ListHeaderComponent={<Header />}
        data={[]}
        renderItem={renderListItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  textInput: { borderWidth: 1, margin: 2 },
  listItem: {
    backgroundColor: 'gainsboro',
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 20,
  },
});

export default App;
