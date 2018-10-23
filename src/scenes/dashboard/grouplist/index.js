//This is the My Groups screen accessible via the burger menu
//Shows the user's current groups he is joined to except public town/state/country groups (which only appear on Group Selector, not in My Groups list below)
//https://api-dev.powerli.ne/api-doc#get--api-v2-user-groups

import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Content,
    Container,
    Title,
    Text,
    Button,
    Icon,
    Header,
    Right,
    Left,
    Thumbnail,
    List,
    ListItem,
    Body
} from 'native-base';
import Menu, {
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers
} from 'react-native-popup-menu';
import {
    View,
    RefreshControl
} from 'react-native';
import PLOverlayLoader from 'PLOverlayLoader';

const PLColors = require('PLColors');
import styles from './styles';
import { openDrawer } from '../../../actions/drawer';
import { getGroups } from 'PLActions';
import ContentPlaceholder from '../../../components/ContentPlaceholder';

class GroupList extends Component{
    constructor(props){
        super(props);

        this.state = {
            groupList: [],
            lock: false,
            refreshing: false
        };        
    }

    componentWillMount(){
       this._onRefresh();
    }

    //Simple listing of user's CURRENT groups. Only shows groups the user is joined to
    loadGroups(){
        let groupList = [];
        var { token }  = this.props;
        this.setState({
            refreshing: true
        });
        getGroups(token).then(data => {
            let groups = data.payload;
            groups.map((item, index) => {
                if(item.official_name && item.joined && item.group_type_label == 'common'){
                    var letter = item.official_name.toUpperCase()[0];
                    var i = this.check(letter);
                    if(i == -1){
                        groupList[groupList.length] = {
                            letter: letter,
                            groups: [item]
                        };
                        
                    }else{
                        groupList[i].groups.push(item);
                        
                    }
                }        

                if(index == groups.length - 1){
                   
                    groupList.sort(function(a, b){
                        return a.letter < b.letter ? -1: (a.letter == b.letter ? 0: 1 );
                    });
                    
                    this.setState({
                        refreshing: false,
                        groupList: groupList,
                        
                    });
                }
            });
            this.setState({ refreshing: false });

        })
        .catch(err => {
            this.setState({ refreshing: false });
            //console.log(err);
        });
    }

    check(letter){
        for(var i = 0; i < this.state.groupList.length; i++){
            if(letter == this.state.groupList[i].letter){
                return i;
            }
        }

        return -1;
    }

    //Shortcut to go to Search for a group that user is presumably not already linked to
    goToSearch(){
        Actions.groupsearch();
    }

    //Gives user ability view the Group Profile for the selected group
    goToProfile(group){
        Actions.groupprofile(group);
    }

    _onRefresh = () => {
        this.loadGroups();
    }

    render(){
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container>
                    <Header style={styles.header}>
                        <Left style={{flex: 1}}>
                            <Button style={{width: '100%'}} transparent onPress={this.props.openDrawer}>
                                <Icon active name='menu' style={{color: 'white'}} />
                            </Button>
                        </Left>
                        <Body style={{flex: 1, alignItems: 'center'}}>
                            <Title style={{color: '#fff'}}>My Groups</Title>
                        </Body>
                        <Right style={{flex: 1}}>
                            {/*We need to make it easier for user to tap this button. Larger tappable area needed*/}
                            <Button transparent onPress={() => this.goToSearch()}>
                                <Icon active name='add-circle' style={{color: 'white'}} />
                            </Button>
                        </Right>
                    </Header>
                    <Content padder
                        refreshControl={Platform.OS === 'android'
                        ? <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        /> : null}
                        onScroll={(e) => {
                            var offset = e.nativeEvent.contentOffset.y;
                            if (Platform.OS === 'ios' && offset < -3) {
                                this._onRefresh();
                            }
                        }}
                        >
                        <ContentPlaceholder
                            refreshControl={<RefreshControl onRefresh={() => this._onRefresh()} refreshing={false} />}
                            empty={!this.state.isRefreshing && !this.state.isLoading && this.state.groupList.length === 0}
                            title="It seems like you don't belong to any group yet" />
                        <List style={{backgroundColor: 'white', marginTop: 17}}>
                            {
                                this.state.groupList.map((itemGroups, index1) => {
                                    console.log('itemGroups', itemGroups);
                                    return (
                                        <View key={index1}>
                                            <ListItem itemHeader style={styles.itemHeaderStyle}>
                                                <Text style={styles.itemHeaderText}>{itemGroups.letter}</Text>
                                            </ListItem>
                                            {
                                                itemGroups.groups.map((item, index2) => {                                                    
                                                    return (
                                                        <ListItem style={styles.listItem}  key={index2} onPress={() => this.goToProfile(item)}>
                                                            {item.avatar_file_path?
                                                                <Thumbnail square source={{uri: item.avatar_file_path+'&w=150&h=150&auto=compress,format,q=95'}} />:
                                                                <View style={{width: 56, height: 56}} />
                                                            }
                                                            <Body>
                                                                <Text style={styles.text1}>{item.official_name}</Text>
                                                            </Body>
                                                        </ListItem>
                                                    );                                                    
                                                })
                                                
                                            }
                                        </View>
                                    );
                                })
                            }                           
                        </List>
                    </Content>
                    <PLOverlayLoader visible={this.state.refreshing} logo marginTop={200} />                       
                </Container>
            </MenuContext>
        );
    }
}

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop,
};

const mapStateToProps = state => ({
    token: state.user.token,
    page: state.activities.page,
    totalItems: state.activities.totalItems,
    payload: state.activities.payload,
    count: state.activities.count,
});

const mapDispatchToProps = dispatch => ({
    openDrawer: ()=> dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupList);