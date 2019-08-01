var React = require('react')
var ReactNative = require('react-native');
var moment = require('moment');
var TimerMixin = require('react-timer-mixin');

var { PropTypes } = React;
var { Text } = ReactNative;

class TimeAgo extends React.Component {
    render() {
        return (
          <Text {...this.props}>{moment(this.props.time).fromNow(this.props.hideAgo)}</Text>
        );
      }
}


export default TimeAgo
