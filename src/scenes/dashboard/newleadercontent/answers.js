import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import {Button, Icon} from 'native-base';
import styles from './styles';
import PLColors from 'PLColors';


class Answers extends Component {

    constructor(props){
        super(props);
        this.state = {
            answers: [''],
        }
    }

    setAnswer(text, index){
        let {answers} = this.state;
        answers[index] = text;
        this.setState({answers});
        this.props.setAnswer(answers);
    }
    
    addAnswer(){
        let {answers} = this.state;
        answers.push(answers.length);
        this.setState({answers});
        this.props.setAnswer(answers);
    }

    removeAnswer(key){
        console.log('key')
        let {answers} = this.state;
        answers = answers.filter((answer, index) => index !== key);
        this.setState({answers});
        this.props.setAnswer(answers);
    }

    renderAnswers(answers, answersPlaceholder){
        return (
            <View style={styles.answerMainContainer}>
                {
                    answers.map((answer, index)=>
                        <View key={index} style={styles.answerOptionContainer}>
                            <TextInput
                                maxLength={10000}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                ref={(r) => this.descriptionRef = r}
                                onSelectionChange={this.onSelectionChange}
                                placeholderTextColor='rgba(0,0,0,0.1)'
                                style={styles.answerInput}
                                placeholder={answersPlaceholder}
                                value={answer}
                                onChangeText={(text) => this.setAnswer(text, index)}
                            />
                            <Button transparent style={styles.answersRemoveOptionButton} onPress={() => this.removeAnswer(index)}>
                                    <Icon name="md-close-circle" style={styles.answersRemoveOptionIcon} />
                            </Button>
                        </View>)
                }
            </View>);
    }

    render(){
        let {answers} = this.state;
        let {answersPlaceholder, addAnswersButton} = this.props;
        return (
            <View>
                {
                    this.renderAnswers(answers, answersPlaceholder)
                }
                <Button style={{backgroundColor: PLColors.main, marginTop: 16}} onPress={() => this.addAnswer()}>
                    <View>
                        <Icon name="md-add-circle" />
                    </View>
                    <Text style={{color: '#fff'}} >{addAnswersButton}</Text>
                </Button>

            </View>
        );
    }
}


export default Answers;
