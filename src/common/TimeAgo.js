import React, { Component } from 'react';
import moment from 'moment';

class TimeAgo extends Component {
    render() {
        return (
            <Text>{moment(this.props.time).fromNow()}</Text>
        )
    }
}

export default TimeAgo
