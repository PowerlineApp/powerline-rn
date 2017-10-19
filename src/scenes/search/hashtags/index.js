import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  FlatList
} from 'react-native';

import {
  Content,
  Container,
} from 'native-base';
import styles from './styles';
import FeedActivity from '../../../components/Feed/FeedActivity';

class SearchHashtags extends Component {
  render() {
    const { posts, token, profile } = this.props;

    return (
      <Container style={styles.container}>
        <Content>
          <FlatList
            data={posts}
            renderItem={({ item }) => <FeedActivity item={item} token={token} profile={profile} />}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  token: state.user.token,
  profile: state.user.profile,
});

export default connect(mapStateToProps)(SearchHashtags);