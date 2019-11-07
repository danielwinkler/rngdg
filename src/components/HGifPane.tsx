import React, { Component } from 'react';
import {
  Text,
  FlatList,
  ImageURISource,
  ListRenderItemInfo,
  View,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { IState } from '../store/store';

interface PropsFromState {
  gifs: ImageURISource[];
}
interface OwnProps {
  term: string;
}
type Props = PropsFromState & OwnProps;

const renderGif = ({ item, index }: ListRenderItemInfo<ImageURISource>) => (
  <View key={index} style={styles.image}>
    <Image style={styles.stretch} source={item} />
  </View>
);

class HGifPane extends Component<Props> {
  public render = () => (
    <View style={styles.pane}>
      <Text style={styles.text}>{this.props.term.toUpperCase()}</Text>
      <FlatList horizontal data={this.props.gifs} renderItem={renderGif} />
    </View>
  );
}

const maxSize = Dimensions.get('window').width * 0.5;
const styles = StyleSheet.create({
  stretch: {
    width: maxSize,
    height: maxSize,
    resizeMode: 'contain',
  },
  image: { marginRight: 5 },
  text: { marginLeft: 10 },
  pane: { minHeight: maxSize },
});

const mapStateToProps = (state: IState, { term }: OwnProps): PropsFromState => ({
  gifs: state.images[term] || [],
});

export default connect(mapStateToProps)(HGifPane);
