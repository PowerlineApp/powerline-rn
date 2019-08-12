import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Platform, View, StyleSheet, Image, Modal} from 'react-native'
import {
    Container, Header, Content, Button, Icon, ListItem, Text, Title,
    Left, Right, Body, Input, Spinner, Badge, H1, H2, H3, Textarea, Form, Small, List, Thumbnail
} from "native-base";

import MapView from 'react-native-maps';
import marker from '../../assets/icons8-marker.png'
var PLColors = require('../../common/PLColors');

// style
import commonColor from "../../configs/commonColor";
import { Actions } from 'react-native-router-flux';
import CommunityView from '../../components/CommunityView';
import Geolocation from '@react-native-community/geolocation';

const styles = {
    headerStyle: {
        backgroundColor: PLColors.main
    },
    leftBtnStyle: {width: 200, height: 50, color: '#fff'},
    containerStyle: {backgroundColor: '#fff'},
    headerTitleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#EEE'
        // color: commonColor.brandPrimary
    },
    contentStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.70)'
    },
    card: {
        shadowOpacity: 0.3,
        shadowRadius: 3,
        backgroundColor: '#FFF',
        margin: 16,
        padding: 8,
        elevation: 3,
        shadowOffset: {
            height: 2,
            width: 2
        },
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ffffffac',
        marginBottom: 8
    },
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    categoriesTitle: {
        marginBottom: 8,
        color: 'gray'
    },
    row: {flexDirection: 'row'},
    categoriesTitlecontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 8
    },
    counter: {
        textAlign: 'right',
        color: 'gray'
    },
    small: {
        color: 'gray',
        fontSize: 12
    },
    attachmentUpload: {
        width: 45,
        height: 45,
        tintColor: 'gray'
    },
    addImageBtn: {
        marginTop: 8, height: 45, backgroundColor: '#efefef', width: 60, borderRadius: 8, justifyContent: 'center', alignItems: 'center'
    },
    map: {
        flex: 1,
      },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 48,
        width: 48
    },
    community_container:{
        borderBottomWidth: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginLeft: 0,
        backgroundColor: PLColors.main
    },
    avatar_container: {
        width: 67,
        height: 50,
        flexDirection: 'row'
    },
    avatar_wrapper: {
        width: 50,
        height: 50,
        backgroundColor: '#444477',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar_img: {
        width: 30,
        height: 30
    },
    avatar_subfix: {
        borderLeftWidth: 16, 
        borderLeftColor: '#444477', 
        borderTopWidth: 25, 
        borderTopColor: 'transparent', borderBottomWidth: 25, borderBottomColor: 'transparent'
    },
    community_text_container: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    community_text: {
        fontSize: 14,
        color: '#fff'
    },
    communicty_icon_container: {
        paddingTop: 10, 
        paddingBottom: 10,
        flex: 0.1
    }
}

const categories = [
    {categorie: 'General', subCategories: ['Trash', 'Pothole', 'Graffiti', 'Lost Item', 'Abandoned Property']},
    {categorie: 'Noise', subCategories: ['Neighbor', 'Animal', 'Construction']},
    {categorie: 'Professional', subCategories: ['Inappropriate Conduct', 'Abuse of Authority']},
    {categorie: 'Safety Hazards', subCategories: ['Flooding', 'Downed Tree', 'Downed Electrical Lines', 'Rabid Animal']}
]

const latitudeDelta = 0.00922
const longitudeDelta = 0.00421

class CommunityReportForm extends Component {
    state = {
        text: '',
        center: {
            latitude: 0,
            longitude: 0,
            latitudeDelta,
            longitudeDelta
        },
        selectedGroupIndex: -1,
        showMap: false,
        loadingLocation: false,
        location: null
    }

    async componentDidMount () {
        this.tryGetCoords()
        this.setInitialGroup()
        this.checkPermissions()
    }

    async checkPermissions () {
        const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
        if (granted) {
            this.setState({permissionsGranted: true})
            // this.tryGetCoords()
            console.log( "You can use the ACCESS_FINE_LOCATION" )
        } 
        else {
            this.setState({permissionsGranted: false})
            console.log( "ACCESS_FINE_LOCATION permission denied" )
        }
    }

    setInitialGroup () {
        var { group } = this.props;
        const ret = this.props.grouplist;
        let showCommunity = true, selectedGroupIndex = -1;
        if (group && group !== 'all'){
            showCommunity = false;
            selectedGroupIndex = ret.map(grouObj => grouObj.id).indexOf(group);
        }
        this.setState({
            grouplist: ret,
            showCommunity,
            selectedGroupIndex
        });
    }

    async tryGetCoords () {
        try {
            const firstCoordinates = await this.getCoordinates()
            if (!this.state.center.latitude) {
                this.setState({center: {
                    ...firstCoordinates,
                    latitudeDelta,
                    longitudeDelta
                }})
            }
        } catch (error) {
            console.log('Failed to get user coordinates, trying again in 5...', error)
            setTimeout(() => {
                this.tryGetCoords()
            }, 500)
        }
    }

    getCoordinates () {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition((position) => {resolve(position.coords)}, () => {}, {}); // Dummy call
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve(position.coords)
            }, (error) => {
                reject(error)
            }, { })
        })
    }


    renderCategories () {
        const chosenCategories = ['Flooding', 'Trash', 'Neighbor']
        const colors = [
             '#007bff', // primary:
             '#6c757d', // secondary:
             '#28a745', // success:
             '#dc3545', // danger:
             '#ffc107', // warning:
             '#17a2b8' // info:
        ]
        const color = index => [{primary: 1}, {danger: 1}, {secondary: 1}, {success: 1}][index % 4]
        return chosenCategories.map((category, index) => <Badge key={index} style={{marginHorizontal: 3, backgroundColor: colors[index % 6]}}>
            <Text>{category}</Text>
        </Badge>)
    }

    renderLocation () {
        const textStyle = {
            margin: 8
        }
        let text = ''
        if (this.state.loadingLocation) {
            text = 'Loading location info...'
        } else if (this.state.location) {
            text = this.state.location
        } else {
            text = 'Mark the location on the map below'
        }

        return <Text style={textStyle}>{text}</Text>
    }

    onChangeText = (text) => this.setState({text})
    onRegionChange = (e, d) => {
        this.setState({center: e})
    }

    openModal = () => {
        this.setState({showMap: true})
    }

    onBack = () => {
        Actions.pop()
    }

    closeMapModal = async () => {
        await this.setState({loadingLocation: true, showMap: false})
        const {latitude, longitude} = this.state.center
        const API_KEY = 'AIzaSyAVO6LZJPCOsiKtyzqbEjdiF3EqZADZ_Nc'
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
        let data = await fetch(url,
        {
            method: 'GET'
        })
        data = await data.json()
        if (data && data.results && data.results.length && data.results[0].formatted_address) {
            await this.setState({loadingLocation: false, location: data.results[0].formatted_address})
        } else {
            await this.setState({loadingLocation: false, location: null})
        }
    }

    closeCommunityModal = () => {
        this.setState({showCommunity: false})
    }
    openCommunityModal = () => {
        this.setState({showCommunity: true})
    }
    selectGroupList = (index) => {
        this.setState({
            selectedGroupIndex: index,
            showCommunity: false
        });
        // load categories ?
    }

    attachImage = (e, data) => {
        console.log('attachImage', e, data)
    }

    render () {
        const {addImageBtn, small, attachmentUpload, counter, card, categoriesTitlecontainer, row,
            categoriesTitle, categoriesContainer, categoriesButton, centerContainer, rightContainer, leftContainer,
            headerStyle, leftBtnStyle, containerStyle, contentStyle, headerTitleStyle,
            community_container, avatar_container, avatar_wrapper, avatar_img, avatar_subfix, community_text_container, community_text, communicty_icon_container
        } = styles
        return (
            <Container style={containerStyle}>
                <Modal onRequestClose={this.closeMapModal} visible={this.state.showMap} animationType='slide'>
                    <View style={{height: 500, width: '100%', flex: 1}}>
                    <MapView
                        style={styles.map}
                        onRegionChangeComplete={this.onRegionChange}
                        initialRegion={this.state.center}
                        />
                        <View style={styles.markerFixed}>
                            <Image style={styles.marker} source={marker} />
                        </View>
                    </View>
                    <Button onPress={this.closeMapModal} style={{width: '100%', justifyContent: 'center', backgroundColor: commonColor.segmentBackgroundColor}}>
                        <H3 style={{color: '#FEFEFE'}}>
                            Done
                        </H3>
                    </Button>
                </Modal>
                    {this.state.showCommunity && <CommunityView
                        grouplist={this.props.grouplist}
                        onPress={this.selectGroupList}
                        onCancel={() => this.selectGroupList(this.state.selectedGroupIndex)}
                    />}
                <Header style={headerStyle}>
                    <Left>
                        <Button transparent onPress={this.onBack} style={leftBtnStyle}>
                        <Icon active name="arrow-back" style={{ color: "#EEE" }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={headerTitleStyle}> Community </Title>
                    </Body>
                    <Right>
                        <View />
                    </Right>
                </Header>
                <List>
                    <ListItem style={community_container} onPress={this.openCommunityModal}>
                        <View style={avatar_container}>
                            <View style={avatar_wrapper}>
                                <Thumbnail square style={avatar_img} source={{ uri: this.props.profile.avatar_file_name + '&w=150&h=150&auto=compress,format,q=95' }} />
                            </View>
                            <View style={avatar_subfix} />
                        </View>
                        <Body style={community_text_container}>
                            <Text style={community_text}>
                                {this.state.selectedGroupIndex === -1 ? 'Select a community' : this.props.grouplist[this.state.selectedGroupIndex].official_name}
                            </Text>
                        </Body>
                    </ListItem>
                </List>
                <Content style={contentStyle}>
                    <View style={card}>
                        <View style={categoriesTitlecontainer}>
                            <H3 style={categoriesTitle}>Categories</H3>
                            <Icon name='menu' />
                        </View>
                        <View style={categoriesContainer}>
                            {this.renderCategories()}
                        </View>
                    </View>
                    <View style={card}>
                        <H3 style={categoriesTitle}>Location</H3>
                        {this.renderLocation()}
                        <Button onPress={this.openModal} style={{width: '100%', justifyContent: 'center', backgroundColor: commonColor.segmentBackgroundColor}}>
                            <Text style={{color: '#FEFEFE'}}>
                                Open Map
                            </Text>
                        </Button>
                    </View>
                    <View style={card}>
                        <H3 style={categoriesTitle}>Observation</H3>
                        <Form>
                            <Textarea rowSpan={6} onChangeText={this.onChangeText} placeholder="Leave a note... this is a placeholder..." />
                        </Form>
                        <Text style={counter}>{this.state.text.length}/2500</Text>
                    </View>
                    <View style={card}>
                        <H3 style={categoriesTitle}>Attachments</H3>
                        <Text style={small}>Leave some images or videos here...</Text>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Button transparent style={addImageBtn}
                                onPress={this.attachImage}>
                                <Icon name='md-add-circle' style={{color: commonColor.segmentBackgroundColor, fontSize: 28}} />
                            </Button>
                        </View>
                    </View>
                </Content>
                <View style={{padding: 16}}>
                    <Button style={{width: '100%', justifyContent: 'center', backgroundColor: commonColor.segmentBackgroundColor}}>
                        <H3 style={{color: '#FEFEFE'}}>
                            Publish
                        </H3>
                    </Button>
                </View>
            </Container>
        )
    }
}
const mapStateToProps = state => ({
    token: state.user.token,
    profile: state.user.profile,
    grouplist: state.groups.payload
});

export default connect(mapStateToProps, {})(CommunityReportForm);