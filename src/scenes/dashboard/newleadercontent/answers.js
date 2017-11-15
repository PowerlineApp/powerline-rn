import React, {Component} from 'react';
import {View, Text, TextInput, Switch} from 'react-native';
import {Button, Icon} from 'native-base';
import styles from './styles';
import PLColors from 'PLColors';


class Answers extends Component {

    constructor(props){
        super(props);
        this.state = {
            answers: [],
            allowUserAmount: false
        };
    }

    componentDidMount(){
        if ( this.props.answerType === 'event' ){
            let answers = [{value: "Yes, I'll go."}, {value: "No, I won't go."}];
            this.setState({answers});
            this.props.setAnswer(answers);
        }
    }

    updateAnswer(key, value, index){
        let {answers} = this.state;
        answers[index][key] = value;
        this.setState({answers});
        this.props.setAnswer(answers);
    }

    
    addAnswer(){
        let {answers} = this.state;
        answers.push(this.props.answerType === 'donation' ? {amount: '', value: '', is_user_amount: false} : {value: ''});
        this.setState({answers});
        this.props.setAnswer(answers);
    }

    removeAnswer(key){
        let {answers} = this.state;
        answers = answers.filter((answer, index) => index !== key);
        this.setState({answers});
        this.props.setAnswer(answers);
    }

    renderAnswers(answers, answersPlaceholder){
        return (
            <View style={styles.answerMainContainer}>
                {this.state.allowUserAmount && answers.length > 0 && <Text style={{alignSelf: 'flex-start'}}>Custom?</Text>}
                {
                    answers.map(({value, amount, is_user_amount}, index)=>
                        <View key={index} style={styles.answerOptionContainer}>
                            {
                            this.state.allowUserAmount &&
                            <View style={{paddingRight: 8}}>
                                <Switch onValueChange={() => {
                                    this.updateAnswer('is_user_amount', !is_user_amount, index);
                                    this.updateAnswer('amount', '', index);
                                }}
                                    value={is_user_amount} 
                                />
                            </View>
                        }
                            {
                            this.props.answerType !== 'donation'
                            ? null
                            :  is_user_amount
                                ? null
                                : [
                                    <TextInput
                                        maxLength={10000}
                                        keyboardType={'numeric'}
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        ref={(r) => this.descriptionRef = r}
                                        onSelectionChange={this.onSelectionChange}
                                        placeholderTextColor='rgba(0,0,0,0.1)'
                                        style={styles.numericInput}
                                        value={amount}
                                        onChangeText={(amount) => this.updateAnswer('amount', amount, index)}
                                />,
                                    <View style={styles.suffixContainer} >
                                        <Text style={styles.suffix} >USD</Text>
                                    </View>
                                ]
                        }
                            <TextInput
                                maxLength={10000}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                ref={(r) => this.descriptionRef = r}
                                onSelectionChange={this.onSelectionChange}
                                placeholderTextColor='rgba(0,0,0,0.1)'
                                style={styles.answerInput}
                                placeholder={answersPlaceholder}
                                value={value}
                                onChangeText={(text) => this.updateAnswer('value', text, index)}
                            />
                            <Button transparent style={styles.answersRemoveOptionButton} onPress={() => this.removeAnswer(index)}>
                                <Icon name='md-close-circle' style={styles.answersRemoveOptionIcon} />
                            </Button>
                        </View>)
                }
            </View>);
    }

    render(){
        let {answers, allowUserAmount} = this.state;
        let {answersPlaceholder, addAnswersButton} = this.props;
        return (
            <View>
                {
                    this.renderAnswers(answers, answersPlaceholder)
                }
                <View style={styles.bottomPanel}>
                    <Button style={{backgroundColor: PLColors.main, marginTop: 16}} onPress={() => this.addAnswer()}>
                        <View>
                            <Icon name='md-add-circle' />
                        </View>
                        <Text style={{color: '#fff'}} >{addAnswersButton}</Text>
                    </Button>
                    {
                        this.props.answerType === 'donation' && 
                        <View style={styles.allowUserAmountSwitch}>
                            <Switch
                                onValueChange={() => 
                                this.setState({
                                    allowUserAmount: !allowUserAmount,
                                    answers: answers.map(answer => 
                                        ({...answer, is_user_amount: false })
                                    )}
                                )}
                                value={allowUserAmount} />
                            <Text style={styles.allowUserAmountTag} >Allow Choose Amount</Text>
                        </View>
                    }
                </View>

            </View>
        );
    }
}


export default Answers;
