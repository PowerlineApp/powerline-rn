//GH35 - The Representative Profile screen accessible via My Representatives on the burger menu

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Spinner,
    Container,
    Header,
    Left,
    Right,
    Button,
    Icon,
    Text,
    Content,
    Body,
    Title,
    List,
    ListItem,
    Thumbnail,
    Grid,
    Col
} from 'native-base';
import {
    View,
    TouchableOpacity,
    RefreshControl,
    Linking,
    Platform
} from 'react-native';
import styles from './styles';
const PLColors  = require('PLColors');
import { loadRepresentatyInfo, loadCommittees, loadSponsoredBills } from 'PLActions';

class RepresentatyProfile extends Component{
    static propTypes = {
        token: React.PropTypes.string
    };

    constructor(props){
        super(props);
        
        this.state = {
            data: null,
            refreshing: false
        };
    }

    componentWillMount(){
        this._onRefresh();
    }

    _onRefresh(){
        this.setState({
            refreshing: true 
        });
        this.loadInfo();
    }

    loadInfo(){
        var { token, storageId } = this.props;

        loadRepresentatyInfo(token, 0, storageId)
        .then(data => {
            console.log(data);
            this.setState({
                refreshing: false,
                data: data
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({
                refreshing: false
            });
        })
    }

    loadCommittees(){
        var { token, storageId } = this.props;

        loadCommittees(token, storageId)
        .then(data => {
            console.log(data);
            alert("Success");
        })
        .catch(err => {
            
        });
    }

    loadSponsoredBills(){
        var { token, storageId } = this.props;

        loadSponsoredBills(token, storageId)
        .then(data => {
            console.log(data);
            alert("Success");
        })
        .catch(err => {

        });
    }

    goToWebsite(url){
        Linking.openURL(url);
    }

    render(){
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()} style={{width: 50, height: 50 }} >
                            <Icon active name="arrow-back" style={{color: 'white'}}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Rep Profile</Title>
                    </Body>
                </Header>
                <Content
                    refreshControl={Platform.OS === 'android' &&
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    onScroll={(e) => {
                        var offset = e.nativeEvent.contentOffset.y;

                        if (Platform.OS === 'ios' && offset < -3) {
                            this._onRefresh();
                        }
                    }}
                >
                    {this.state.data?
                    <View>
                    {this.state.refreshing && <Spinner color='gray' />}
                    <List style={{backgroundColor: 'white'}}>
                        <ListItem>
                            <Thumbnail square size={80}  source={{uri: this.state.data.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95'}}/>
                            <Body>
                                <Text style={{color: PLColors.main}}>{this.state.data.first_name} {this.state.data.last_name}</Text>
                                <Text note style={styles.text1}>{this.state.data.official_title}</Text>
                            </Body>
                        </ListItem>
                    </List>
                    <Grid style={{marginTop: 10, marginBottom: 10}}>
                        <Col style={{paddingLeft: 15,paddingRight: 5}}>
                             <Button full style={{borderRadius: 5, flexDirection: 'row', backgroundColor: PLColors.main}} onPress={()=> this.loadCommittees()}>
                                 <View style={{flex: 0.3}}>
                                    <Icon name='home' />
                                </View>
                                <Text style={{fontSize: 12, flex: 0.7, textAlign: 'center'}}>Committee Membership</Text>
                            </Button>
                        </Col>
                        <Col style={{paddingLeft: 5,paddingRight: 15}}>
                             <Button full style={{borderRadius: 5, flexDirection: 'row', backgroundColor: PLColors.main}} onPress={() => this.loadSponsoredBills()}>
                                 <View style={{flex: 0.3}}>
                                    <Icon name='home' />
                                </View>
                                <Text style={{fontSize: 12, flex: 0.7, textAlign: 'center'}}>Sponsored Bills</Text>
                            </Button>
                        </Col>
                    </Grid> 
                    <List style={{backgroundColor: 'white'}}>
                        {this.state.data.party && this.state.data.party != ""?
                        <ListItem icon style={{height: 65}}>
                            <Left>
                                <Icon name="md-home" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Party</Text>
                                <Text style={styles.text}>{this.state.data.party}</Text>
                            </Body>
                        </ListItem>: null}
                        {this.state.data.birthday && this.state.data.birthday != ""?
                        <ListItem icon style={{height: 65}}>
                            <Left>
                                <Icon name="ios-calendar-outline" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Birthday</Text>
                                <Text style={styles.text}>{this.state.data.birthday}</Text>
                            </Body>
                        </ListItem>:null
                        }
                        {this.state.data.start_term && this.state.data.start_term != ""?
                        <ListItem icon style={{height: 65}}>
                            <Left>
                                <Icon name="ios-calendar-outline" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Term Start</Text>
                                <Text style={styles.text}>{this.state.data.start_term}</Text>
                            </Body>
                        </ListItem>:null}
                        {this.state.data.end_term && this.state.data.end_term != ""?
                        <ListItem icon style={{height: 65}}>
                            <Left>
                                <Icon name="ios-calendar-outline" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Term End</Text>
                                <Text style={styles.text}>{this.state.data.end_term}</Text>
                            </Body>
                        </ListItem>: null}
                        {this.state.data.phone && this.state.data.phone != "" ?
                        <ListItem icon style={{height: 65}} onPress={() => this.goToWebsite('tel:' + this.state.data.phone)}>
                            <Left>
                                <Icon name="ios-call" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Phone Number</Text>
                                <Text style={styles.text}>{this.state.data.phone}</Text>
                            </Body>
                        </ListItem>: null}
                        {this.state.data.fax && this.state.data.fax != ""?
                        <ListItem icon style={{height: 65}}>
                            <Left>
                                <Icon name="ios-fax" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Fax</Text>
                                <Text style={styles.text}>{this.state.data.fax}</Text>
                            </Body>
                        </ListItem>: null}
                        {this.state.data.email && this.state.data.email != ""?
                        <ListItem icon style={{height: 65}} onPress={() => this.goToWebsite('mailto:' + this.state.data.email)}>
                            <Left>
                                <Icon name="ios-mail-open-outline" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>E-mail</Text>
                                <Text style={styles.text}>{this.state.data.email}</Text>
                            </Body>
                            <Right style={{height: 65}}>
                                <Icon name="ios-arrow-forward"/>
                            </Right>
                        </ListItem>: null}
                        {this.state.data.website && this.state.data.website != ""?
                        <ListItem icon style={{height: 65}} onPress={() => this.goToWebsite(this.state.data.website)}>
                            <Left>
                                <Icon name="ios-globe-outline" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Website</Text>
                                <Text style={styles.text}>{this.state.data.website}</Text>
                            </Body>
                            <Right style={{height: 65}}>
                                <Icon name="ios-arrow-forward"/>
                            </Right>
                        </ListItem>:null}
                        {this.state.data.facebook && this.state.data.facebook != ""?
                        <ListItem icon style={{height: 65}} onPress={() => this.goToWebsite(this.state.data.facebook)}>
                            <Left>
                                <Icon name="logo-facebook" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Facebook</Text>
                                <Text style={styles.text}>{this.state.data.facebook}</Text>
                            </Body>
                            <Right style={{height: 65}}>
                                <Icon name="ios-arrow-forward"/>
                            </Right>
                        </ListItem>: null}
                        {this.state.data.twitter && this.state.data.twitter != ""?
                        <ListItem icon style={{height: 65}} onPress={() => this.goToWebsite('https://twitter.com/' + this.state.data.twitter)}>
                            <Left>
                                <Icon name="logo-twitter" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Twitter</Text>
                                <Text style={styles.text}>{this.state.data.twitter}</Text>
                            </Body>
                            <Right style={{height: 65}}>
                                <Icon name="ios-arrow-forward"/>
                            </Right>
                        </ListItem>: null}
                        {this.state.data.youtube && this.state.data.youtube != ""?
                        <ListItem icon style={{height: 65}} onPress={() => this.goToWebsite("http://www.youtube.com/" + this.state.data.youtube)}>
                            <Left>
                                <Icon name="logo-youtube" style={styles.icon}/>
                            </Left>
                            <Body style={{height: 65}}>
                                <Text note style={styles.text1}>Youtube</Text>
                                <Text style={styles.text}>{this.state.data.youtube}</Text>
                            </Body>
                            <Right style={{height: 65}}>
                                <Icon name="ios-arrow-forward"/>
                            </Right>
                        </ListItem>
                        :null}
                    </List>  
                    </View>: null}               
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(RepresentatyProfile);