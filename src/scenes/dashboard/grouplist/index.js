import React, { Component } from 'react';
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

const PLColors = require('PLColors');
import styles from './styles';
import { openDrawer } from '../../../actions/drawer';
import { getGroups } from 'PLActions';

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

    loadGroups(){
        this.state.groupList = [];
        var { token }  = this.props;
        getGroups(token).then(data => {
            var groups = data.payload;
            groups.map((item, index) => {
                if(item.official_name && item.joined && item.group_type_label == 'common'){
                    var letter = item.official_name.toUpperCase()[0];
                    var i = this.check(letter);
                    if(i == -1){
                        this.state.groupList[this.state.groupList.length] = {
                            letter: letter,
                            groups: [item]
                        };
                        
                    }else{
                        this.state.groupList[i].groups.push(item);
                        
                    }
                }        

                if(index == groups.length - 1){
                    console.log(this.state.groupList);
                    
                    this.state.groupList.sort(function(a, b){
                        return a.letter < b.letter ? -1: (a.letter == b.letter ? 0: 1 );
                    });
                    
                    this.setState({
                        groupList: this.state.groupList,
                        refreshing: false
                    });
                }  
            });
        })
        .catch(err => {
            console.log(err);
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

    goToSearch(){
        Actions.groupsearch();
    }

    goToProfile(group){
        Actions.groupprofile(group);
    }

    _onRefresh(){
        this.setState({
            refreshing: true
        });
        this.loadGroups();
    }

    render(){
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            <Button transparent onPress={this.props.openDrawer}>
                                <Icon active name="menu" style={{color: 'white'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>My Groups</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.goToSearch()}>
                                <Icon active name="add-circle" style={{color: 'white'}}/>
                            </Button>
                        </Right>
                    </Header>
                    <Content padder
                        refreshControl={
                                <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        >
                        <List style={{backgroundColor: 'white', marginLeft: 17, marginTop: 17}}>
                            {
                                this.state.groupList.map((itemGroups, index1) => {
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
                                                            <Thumbnail square source={{uri: item.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95'}}/>:
                                                            <View style={{width: 56, height: 56}}/>
                                                            }
                                                            <Body>
                                                                <Text style={styles.text1}>{item.official_name}</Text>
                                                            </Body>
                                                        </ListItem>
                                                    )                                                    
                                                })
                                            }
                                        </View>
                                    );
                                })
                            }                           
                        </List>
                    </Content>
                </Container>
            </MenuContext>
        )
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