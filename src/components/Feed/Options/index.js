import React, {Component} from 'react';
import {View, Text} from 'react-native';

import Option from './option';

class Options extends Component {
    constructor(props){
        super(props);

        this.state = {
            options: props.item.poll.options
        };
    }

    setChecked(index) {
        let {options} = this.state;
        options = options.map((opt, i) => ({...opt, votes_count: i === index ? opt.votes_count + 1 : opt.votes_count,  checked: i === index }));
        this.setState({options});
    }


    render(){
        let {item} = this.props;
        let {options} = this.state;
        return null;
        return (
            <View style={styles.optionsContainer}>
                {
                    options.map((opt, i) => {
                        console.log(opt);
                        return <Option type={item.entity.type} opt={opt} onCheck={() => this.setChecked(i)} />;
                    })
                }
            </View>
        );
    }
}

const styles= {
    optionsContainer: {
        justifyContent: 'flex-start'
    }
};


export default Options;