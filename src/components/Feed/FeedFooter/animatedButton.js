import React, {Component} from 'react';
import {View, TouchableHighlight} from 'react-native';
import {Button, Icon, Label} from 'native-base';
import styles from '../styles';
import * as Animatable from 'react-native-animatable';

class AnimatedButton extends Component {
    
    handlePress(){
        this.props.onPress();
        this.refs.view[this.props.animateEffect](800);
    }
    
    render(){
        return (
            <TouchableHighlight underlayColor="#fff" transparent style={styles.footerButton} onPress={() => this.handlePress()} >
                <Animatable.View ref='view' style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 0}} >
                    {
                        this.props.icon ||
                        <Icon active name={this.props.iconName} style={styles.footerIcon} />
                    }
                    <Label style={this.props.labelStyle || styles.footerText} >
                        {this.props.label}
                    </Label>
                </Animatable.View>
            </TouchableHighlight> 
        );
    }
};

export default AnimatedButton;