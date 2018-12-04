import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import UserList from '../../../components/UserList'

import styles from './styles'

class ConferenceAttendees extends React.Component {
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

const mapStateToProps = ({ attendees }) => ({
    attendees: Object.values(attendees || {})
})

export default connect(mapStateToProps)(ConferenceAttendees)
