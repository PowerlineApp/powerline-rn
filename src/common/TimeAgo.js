import React, { Component } from 'react';
import moment from 'moment';

class TimeAgo extends Component {
    render() {
        return (
            <Text>{moment(this.props.time).fromNow(this.props.hideAgo)}</Text>
        )
    }
}

export default TimeAgo
