import React, { PureComponent, PropTypes } from 'react';

import { Input as NBInput } from 'native-base';

class Input extends PureComponent {
  render() {
    return (
        <NBInput {...this.props}>{this.props.children}</NBInput>
    );
  }
}

export default Input;
