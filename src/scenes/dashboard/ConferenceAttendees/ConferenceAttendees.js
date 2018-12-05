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
      const { token, id } = this.props;
      this.props.fetchAttendees(token, id).then(data => {
        console.log('data-----', data);
      });
    }

    componentWillReceiveProps(nextProps) {
      console.log("componentWillReceiveProps at conferenceevents", nextProps);
      if (nextProps.conferences && nextProps.schedule !== this.state.schedule) {
        const key = Object.keys(nextProps.schedule)[0]

        this.setState({

            selected: key,
            label: this.getDateFromKey(key)
        });
      }
    }

    render() {
        return (
            <View style={styles.container}>
                <UserList
                    renderAvatars={false}
                    renderActions={false}
                    users={this.props.attendees}
                    renderEmail={true}
                    subTextKey={['title', 'organization']}
                    subTextKeySeperator="at "
                />
            </View>
        )
    }
}

function bindAction(dispatch) {
  return {
    fetchAttendees: token => dispatch(fetchAttendees(token, id)),
  };
}

const mapStateToProps = ({ attendees }) => ({
    attendees: Object.values(attendees || {})
})

export default connect(mapStateToProps, bindAction)(ConferenceAttendees)
