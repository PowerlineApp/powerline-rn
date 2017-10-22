import React, {Component} from 'react';
import {Textarea} from 'native-base';
import randomPlaceholder from '../../utils/placeholder';
import SuggestionBox from '../../common/suggestionBox';

import styles from './styles';

class TextAreaWithSuggestion extends Component {
    constructor (props) {
        super(props);
        this.placeholderTitle = randomPlaceholder('petition');
    }

    render () {
        return (
        [

            <SuggestionBox key={'suggestion-box'} />,
            <Textarea placeholderTextColor='rgba(0,0,0,0.1)'
                style={styles.textarea}
                onSelectionChange={this.props.onSelectionChange}
                placeholder={this.placeholderTitle}
                value={this.props.content}
                onChangeText={(text) => this.props.changeContent(text)}
                key={'text-area'}
            />
        ]
        );
    }
}

export default TextAreaWithSuggestion;
