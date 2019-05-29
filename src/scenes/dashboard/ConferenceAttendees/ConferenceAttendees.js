import React from 'react'
import { connect } from 'react-redux'
import { View, Platform } from 'react-native'
import UserList from '../../../components/UserList/UserList'
import commonColor from "../../../configs/commonColor";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Title,
  Left,
  Right,
  Body,
  Input,
  Spinner
} from "native-base";
import {
  fetchAttendees
} from "PLActions";

import styles from './styles'

class ConferenceAttendees extends React.Component {
  state = {
    data: [],
    loading: true
  }
    componentDidMount() {
      const { token, conferences } = this.props;
      if(conferences && conferences.data.length > 0) {
        this.props.fetchAttendees(token, conferences.data[0].id).then(({data}) => {
          console.log('fetched attendees---', data);
          this.setState({data, loading: false})
        });
      }
    }

    componentWillReceiveProps(nextProps) {
      console.log("componentWillReceiveProps at conferenceevents", nextProps);
      if (nextProps.conferences) {
        const key = Object.keys(nextProps.schedule)[0];

        this.setState({
            selected: key,
            label: this.getDateFromKey(key)
        });
      }
    }

    onBack = () => {
      this.props.navigation.goBack();
    };

    render() {
      console.log(commonColor, 'commonColor')
      // const { attendees } = this.props.conferences || [];
      const attendees = this.state.data
      if (this.state.loading) return null
      console.log('attendees--', attendees, this.props);
      return (
        <Container style={{ backgroundColor: "#fff" }}>
        <Header
          androidStatusBarColor={commonColor.statusBarLight}
          iosBarStyle="dark-content"
          style={Platform.OS === "ios" ? styles.iosHeader : styles.aHeader}
        >
          <Left>
            <Button
              transparent
              onPress={() => this.onBack()}
              style={{ width: 200, height: 50 }}
            >
              <Icon active name="arrow-back" style={{ color: "#6A6AD5" }} />
            </Button>
          </Left>
          <Body>
            <Title
              style={
                Platform.OS === "ios"
                  ? styles.iosHeaderTitle
                  : styles.aHeaderTitle
              }
            >
              Attendees
            </Title>
          </Body>
          <Right>
            
          </Right>
        </Header>
          <UserList
            renderAvatars={false}
            renderActions={false}
            users={attendees}
            renderEmail={true}
            subTextKey={['title', 'organization']}
            subTextKeySeperator="at "/>
        </Container>
      )
    }
}

function bindAction(dispatch) {
  return {
    fetchAttendees: (token, id) => dispatch(fetchAttendees(token, id)),
  };
}

const mapStateToProps = state => ({
  conferences: state.conferences,
  token: state.user.token,
  attendees: state.attendees,
})

export default connect(mapStateToProps, bindAction)(ConferenceAttendees)
