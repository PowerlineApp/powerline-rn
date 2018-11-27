import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { CachedImage } from 'react-native-img-cache'
import {
    Platform,
    ScrollView,
    Alert,
    Linking,
    View,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Ionicon from 'react-native-vector-icons/Ionicons'

import {
  fetchConferences
} from "PLActions";

import styles from './styles'
const  homeNavigator = require('./').navigator;

class SimpleHomeScreen extends React.Component {
    constructor(props) {
        super(props)
        console.log('props-------------', props.conferences);
        
        this.state = {
          items: [
              {
                  label: 'Home',
                  icon: 'md-home',
                  onPress: this.gotoFeed
              },
              {
                  label: 'Schedule',
                  icon: 'md-calendar',
                  onPress: this.gotoSchedule
              },
              {
                  label: 'Attendees',
                  icon: 'md-contacts',
                  onPress: this.gotoAttendees
              },
              {
                  label: 'Feed',
                  icon: 'md-star',
                  onPress: () => this.gotoFeed(false)
              },
              {
                  label: 'New Post',
                  icon: 'md-add',
                  onPress: this.gotoCreatePost
              },
              {
                  label: 'My Reps',
                  icon: 'md-book',
                  onPress: this.gotoRepresentatives
              }
          ]
        };

        console.warn('Services:', props.conciergeServices)

        if (props.conciergeServices && Object.values(props.conciergeServices).length > 0) {
            this.state.items.push({
                label: 'Services',
                icon: 'ios-link',
                onPress: () => this.requestServices()
            })
        }
   

        
    }

    componentDidMount() {
      console.log('componentDidMount');
      this.props.fetchConferences().then(data => {
        console.log('data-----', data);
      });
    }

    componentWillReceiveProps(nextProps) {
      console.log("componentWillReceiveProps at custom home screen");
      if (nextProps.conferences && nextProps.confenrences !== this.state.conferences) {
        this.setState({ conferences: nextProps.conferences });
        conference = conferences[0];
        if (conference && conference.links) {
            conference.links.forEach(link => {
                console.warn('LINK:', link)
                this.state.items.push({
                    label: link.label,
                    onPress: () =>
                        Linking.openURL(
                            Platform.OS === 'android' ? link.androidUrl : link.iosUrl
                        ),
                    icon: 'ios-link'
                })
            })
        }
      }
    }

    gotoSchedule = () => {
        homeNavigator.instance.goTo('conferenceEvents', {
            title: 'Events',
            back: true
        })
    }

    gotoAttendees = () => {
        homeNavigator.instance.goTo(
            'conferenceAttendees',
            {
                title: 'Attendees',
                back: true
            }
        )
    }

    gotoCalendar = () => {}

    gotoProfile = () => {
        homeNavigator.instance.goTo('userProfile', {
            title: 'My Profile',
            back: true
        })
    }

    gotoFeed = (home = true) => {
        if (!home) {
            this.props.dispatch({
                type: 'NEWSFEED_STATE',
                payload: { activeGroup: this.state.conference.groupId }
            })
            
        } else {
            this.props.dispatch({
                type: 'NEWSFEED_STATE',
                payload: { activeGroup: 'all' }
            })
        }
        homeNavigator.instance.goTo('rootTabs', {
            title: 'Recent Posts',
            rightItem: {
                onPress: () => {
                    homeNavigator.instance.goTo('search', {
                        content: (
                            <TextInput
                                style={{ flex: 1, color: 'white' }}
                                onChangeText={this.onSearchQueryChanged}
                                placeholder="Search groups, people, topics"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            />
                        ),
                        back: true
                    })
                },
                component: <Ionicon name="md-search" size={24} color="white" />
            }
        })
    }

    gotoRepresentatives = () => {
        homeNavigator.instance.goTo('representatives', {
            title: 'Representatives',
            back: true
        })
    }

    gotoCreatePost = () => {
        // this.gotoFeed(false)
        setTimeout(() => {
            homeNavigator.instance.goTo(
                'createPost',
                {
                    title: `New post`,
                    back: true
                },
                {
                    _selectedGroup: this.state.conference.groupId,
                    scope: {
                        group: true,
                        type: 'post'
                    }
                }
            )
        }, 1000)
    }

    requestServices = () => {
        let services = Object.values(this.props.conciergeServices)
        if (services.length === 0) {
            return Alert.alert(
                'Not available',
                'There are no services available for this group.'
            )
        }

        let labels = services.map((service, index) => service.message)

        this.props.dispatch({
            type: 'SET_ACTIONSHEET_STATE',
            payload: {
                isVisible: true,
                title: 'Select one...',
                options: labels.concat('Cancel'),
                cancelButtonIndex: labels.length,
                onPress: async index => {
                    if (index == null) return
                    let service = services[index]

                    this.props.dispatch({
                        type: 'ACTIONSHEET_STATE',
                        payload: { isVisible: false }
                    })

                    let result = await require('./').services.request(
                        service.id
                    )
                    if (result.success) {
                        return Alert.alert(
                            'Thanks!',
                            'Your service request has been received and we will take care of it as soon as possible.'
                        )
                    } else {
                        if (result.error.error.request.status === 400) {
                            return Alert.alert(
                                'Info',
                                'You can only request a service once every ten minutes.'
                            )
                        } else {
                            return Alert.alert(
                                'Uh oh..',
                                'An unexpected error has occured, please try again later.'
                            )
                        }
                    }
                }
            }
        })
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.conference && this.state.conference.image && (
                    <CachedImage
                        source={{ uri: this.state.conference.image }}
                        style={styles.header}
                    />
                )}

                <View style={styles.wrapper}>
                    {this.state.items.map((item, index) => {
                        return (
                            <TouchableOpacity
                                style={styles.item}
                                index={item.label}
                                onPress={item.onPress}>
                                <View style={styles.iconContainer}>
                                    <Ionicon
                                        name={item.icon}
                                        size={32}
                                        color="white"
                                    />
                                </View>
                                <Text style={styles.label}>{item.label}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = ({ conferences, conciergeServices }) => ({
    conferences,
    conciergeServices
})


export default connect(mapStateToProps, {fetchConferences})(SimpleHomeScreen)