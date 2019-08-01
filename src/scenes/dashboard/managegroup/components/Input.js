import React, { PureComponent, PropTypes } from 'react';
import { Input as NBInput, Text } from 'native-base';
import { TextInput as NVInput, View } from 'react-native';

import PLColors from '../../../../common/PLColors';
import styles from '../styles';

class Input extends PureComponent {
    render() {
        return (
            <View style={[styles.inputContainer, this.props.style]}>
                <NBInput
                    {...this.props}
                    style={styles.inputText}
                    placeholderTextColor={PLColors.lightText}
        />
            </View>
        );
    }
}

export default Input;
