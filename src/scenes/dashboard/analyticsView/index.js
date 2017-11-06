import React, { Component } from 'react'
import { View, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import { fetchAnalytics, fetchUserRepresentatives } from '../../../actions/analytics'
import {
    Content,
    Container,
    Item,
    Input,
    Title,
    Button,
    Radio,
    Header,
    Spinner,
    Body,
    Left,
    Right,
    Label,
    Icon,
    List,
    ListItem,
    Thumbnail,
    Text
} from 'native-base';
import FilterAnalytics from './filter'
import styles from './styles'
import { Circle } from 'react-native-progress';
const filterOptions = ['Count of Total Upvotes', '% of Total Upvotes', 'Count of Total Downvotes', '% of Total Downvotes', 'Count of All Votes']
const dataTypeOptions = ['My Elected Leaders', 'Top 10 Elected Leaders']

class AnalyticsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: null,
            viewTypeModal: false,
            dataTypeModal: false,
            viewType: 'Count of Total Upvotes',
            viewData: 'My Elected Leaders'
        }
    }

    componentDidMount() {
        const { fetchAnalytics, entityId } = this.props;
        
        fetchAnalytics(entityId)
    }

    componentWillReceiveProps (nextProps) {
        console.log('componentWillReceiveProps', nextProps)
        if(nextProps.error) {
            Alert.alert('Error',
                'Could not fetch analytics for this post', [
                    {text: 'Dismiss', onPress: () => Actions.pop()}
                ] 
            )
        }
    }
    renderTotalCountOfVotes(representative, prop) {
        return (
            <View>
                <Text>{representative[prop]}</Text>
                <Text style={{fontSize: 13, color: 'grey'}}>Votes</Text>
            </View>
        )
    }

    renderMyElectedLeaders (representatives) {
        return (
            <List>
                {representatives.map(rep => {
                    return (
                        <ListItem style={{paddingVertical: 20, height: 80, justifyContent: 'space-between'}} >
                            <View style={{alignItems: 'flex-start'}}>
                                <Text>{rep.first_name} {rep.last_name}</Text>
                                <Text style={{fontSize: 13,color: 'grey', alignSelf: 'flex-start'}}>{rep.official_title}</Text>
                            </View>
                            {this._viewTypeSelector(rep)}
                        </ListItem>
                    )
                })}
            </List>
        )
    }

    renderPercentageOfVotes(representative, prop) {
        const total = +representative.upvotes + +representative.downvotes;
        if(prop === 'upvotes') {
            const percentage = +representative.upvotes / total
            return (
                <View>
                    <Circle animated size={60} progress={percentage} showsText formatText={() => `${percentage * 100}%`}/>
                </View>
            )
        }
        if(prop === 'downvotes') {
            const percentage = +representative.downvotes / total
            return (
                <View>
                    <Circle animated size={60} progress={percentage} showsText formatText={() => `${percentage * 100}%`}/>
                </View>
            )
        }
    }

    renderTotalVotes(representative) {
        const sum = +representative.downvotes + +representative.upvotes;
        return (
            <View>
                <Text>{sum}</Text>
                <Text>Votes</Text>
            </View>
        )
    }

    _viewTypeSelector(representative) {
        if(this.state.viewType === 'Count of Total Upvotes') {
            return this.renderTotalCountOfVotes(representative, 'upvotes')
        }
        if(this.state.viewType === '% of Total Upvotes') {
            return this.renderPercentageOfVotes(representative, 'upvotes')
        }
        if(this.state.viewType === 'Count of Total Downvotes') {
            return this.renderTotalCountOfVotes(representative, 'downvotes')
        }
        if(this.state.viewType === '% of Total Downvotes') {
            return this.renderPercentageOfVotes(representative, 'downvotes')
        }
        if(this.state.viewType === 'Count of All Votes') {
            return this.renderTotalVotes(representative)
        }
    }

    _viewDataSelector() {
        if(this.state.viewData === "My Elected Leaders") {
            return this.renderMyElectedLeaders(this.props.analytics.representatives)
        }
        if(this.state.viewData === "Top 10 Elected Leaders") {
            return this.renderMyElectedLeaders(this.props.analytics.most_popular)
        }
    }

    render() {
        console.log(this.props)
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()} style={{width: 50, height: 50 }}  >
                            <Icon active name="arrow-back" style={{color: 'white'}}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{alignSelf: 'flex-start', color: 'white'}}>Analytics: {this.state.viewData ? this.state.viewData : 'My Elected Leaders'}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.setState({dataTypeModal: true})}>
                        <Icon active name="md-funnel" style={{color: 'white'}}/>
                        </Button>
                    </Right>
                </Header>
                
                {!this.props.loading && this.props.analytics !== null ? <Content padder>
                    <View style={{width: '100%', padding: 15}}>
                        <Text>The troubles that we have as a society can only be overcome if our elected leaders are accountable and responsive to the will of the people in between elections</Text>
                    </View>
                    <View style={{width: '80%', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 15, marginVertical: 20}}>
                        <Counter type='Upvotes' number={this.props.analytics.total.upvotes}/>
                        <Counter type='Downvotes' number={this.props.analytics.total.downvotes}/>
                    </View>
                    <View style={{width: '100%', padding: 15, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#bbb', borderTopColor: '#bbb'}}>
                        <TouchableOpacity onPress={() => this.setState({viewTypeModal: true})} >
                            <Text style={{fontSize: 14}}><Text style={{fontSize: 14, color: 'grey', fontWeight: 'bold'}}>SHOW:</Text> {this.state.viewType}</Text>
                        </TouchableOpacity>
                    </View>
                    {this._viewDataSelector(this.props.analytics.representatives)}
                    <Modal visible={this.state.viewTypeModal} presentationStyle='pageSheet' transparent>
                        <View style={{flex: 1, backgroundColor: rgb(0,0,0,0.7), alignItems: 'center', justifyContent: 'center'}}>
                            <FilterAnalytics selected={this.state.viewType} options={filterOptions} onChange={item => this.setState({viewType: item, viewTypeModal: false})}/>
                        </View>
                    </Modal>
                    <Modal visible={this.state.dataTypeModal} presentationStyle='pageSheet' transparent>
                        <View style={{flex: 1, backgroundColor: rgb(0,0,0,0.7), alignItems: 'center', justifyContent: 'center'}}>
                            <FilterAnalytics selected={this.state.viewData} options={dataTypeOptions} onChange={item => this.setState({viewData: item, dataTypeModal: false})}/>
                        </View>
                    </Modal>
                </Content> : <View style={{flex: 1}}><Spinner /></View>}
            </Container>
        )
    }
}


const mapStateToProps = (state) => ({
    loading: state.analytics.loading,
    analytics: state.analytics.analytics,
    error: state.analytics.error
})

const mapActionsToProps = (dispatch) => ({
    fetchAnalytics: (id) => dispatch(fetchAnalytics(id)),
    fetchRepresentatives: () => dispatch(fetchUserRepresentatives())
})

export default connect(mapStateToProps, mapActionsToProps)(AnalyticsView)

const Counter = props => (
    <View style={{flexDirection: 'row'}}>
        <Icon name={props.type === 'Upvotes' ? 'ios-arrow-round-up' : 'ios-arrow-round-down'} size={20}/>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{fontSize: 30}}>{props.number}</Text>
            <Text style={{color: 'grey', fontSize: 10, fontWeight: 'bold'}}> Total of {props.type}</Text>
        </View>
    </View>
)

