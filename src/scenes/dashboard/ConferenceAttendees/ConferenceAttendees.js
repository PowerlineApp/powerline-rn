import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import UserList from '../../../components/UserList'

import {
  fetchAttendees
} from "PLActions";

import styles from './styles'

class ConferenceAttendees extends React.Component {
    componentDidMount() {
      const { token, conferences } = this.props;
      if(conferences && conferences.length > 0) {
        this.props.fetchAttendees(token, conferences[0].id).then(data => {
          console.log('fetched attendees---', data);
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

    render() {
      const { attendees } = this.props.conferences;
      console.log('attendees--', attendees);
      return (
        <View style={styles.container}>
        {
          attendees && <UserList
            renderAvatars={false}
            renderActions={false}
            users={attendees}
            renderEmail={true}
            subTextKey={['title', 'organization']}
            subTextKeySeperator="at "
          />
        }
        </View>
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
