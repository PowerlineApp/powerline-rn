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
    TextInput,
    Image
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Ionicon from 'react-native-vector-icons/Ionicons'

import {
  fetchConferences,
  listServices,
} from "PLActions";

import styles from './styles'
const  homeNavigator = require('./navigator');

class SimpleHomeScreen extends React.Component {
    constructor(props) {
      super(props)
     
      this.state = {
        items: [
          {
              label: 'Home',
              icon: <Image source={require('img/home_icon.png')} style={styles.icon} />,
              onPress: this.gotoFeed
          },
          {
              label: 'Schedule',
              icon: <Image source={require('img/schedule_icon.png')} style={styles.icon} />,
              onPress: this.gotoSchedule
          },
          {
              label: 'Attendees',
              icon: <Image source={require('img/attendees_icon.png')} style={styles.icon} />,
              onPress: this.gotoAttendees
          },
          {
              label: 'Feed',
              icon: <Image source={require('img/feed_icon.png')} style={styles.icon} />,
              onPress: () => this.gotoFeed(false)
          },
          {
              label: 'New Post',
              icon: <Image source={require('img/new_post_icon.png')} style={styles.icon} />,
              onPress: this.gotoCreatePost
          },
          {
              label: 'My Reps',
              icon: <Image source={require('img/my_reps_icon.png')} style={styles.icon} />,
              onPress: this.gotoRepresentatives
          },
          {
              label: 'Services',
              icon: <Image source={require('img/link_icon.png')} style={styles.icon} />,
              onPress: () => this.gotoServices()
          }
        ],
        conferences: [],
        conciergeServices: [],
      };
    }

    componentWillMount() {
      const { token } = this.props;
      this.props.fetchConferences(token);
      this.props.listServices(token).then(data => {
      });
    }

    componentWillReceiveProps(nextProps) {
      console.log('conferences---', this.state.conferences);
      console.log('nextConferences----', nextProps);

      const { conciergeServices, conferences } = this.state;
      if (nextProps.conferences && conferences.length === 0) {

        if (Object.values(nextProps.conferences.data).length > 0) {
          this.setState({ conferences: nextProps.conferences.data });
          const conference = nextProps.conferences.data[0];
          this.setState({ conference });
          if (conference && conference.links) {
              conference.links.forEach(link => {
                const url = Platform.OS === 'android' ? link.androidUrl : link.iosUrl;
                this.state.items.push({
                  label: link.label,
                  onPress: () => {
                    if(url) {
                      Linking.openURL(url);
                    } else {
                      Alert.alert("Error", "The url is invalid");
                    }
                  },  
                  icon: <Image source={require('img/link_icon.png')} style={styles.icon} />
                })
              })
          }
        }
      }
      if (nextProps.conciergeServices && conciergeServices !== nextProps.conciergeServices.data) {
          this.setState({ conciergeServices: nextProps.conciergeServices.data });
      }
    }

    gotoSchedule = () => {
      const { conference } = this.state;
      if(conference) {
        homeNavigator.instance.goTo('conferenceEvents', {
          title: 'Events',
          back: true,
        })
      }
    }

    gotoAttendees = () => {
      const { conference } = this.state;
      if(conference) {
        homeNavigator.instance.goTo(
            'conferenceAttendees',
            {
                title: 'Attendees',
                back: true,
                id: conference.id
            }
        )
      }
    }

    gotoCalendar = () => {}

    gotoProfile = () => {
        homeNavigator.instance.goTo('profile', {
            title: 'My Profile',
            back: true
        })
    }

    gotoFeed = (home = true) => {
      if (!home) {
        if (this.state.conference) {
          this.props.dispatch({
            type: 'NEWSFEED_STATE',
            payload: { activeGroup: this.state.conference.groupId }
          })
        }
        homeNavigator.instance.goTo('originalHome', {
            content: (
                <TextInput
                    style={{ flex: 1, color: 'white' }}
                    onChangeText={this.onSearchQueryChanged}
                    placeholder="Search groups, people, topics"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
            ),
            back: true
        });
      } else {
        this.props.dispatch({
            type: 'NEWSFEED_STATE',
            payload: { activeGroup: 'all' }
        })
        homeNavigator.instance.pop();
      }
    }

    gotoRepresentatives = () => {
      homeNavigator.instance.goTo('representatives', {
        title: 'Representatives',
        back: true
      })
    }

    gotoServices = () => {
      const { conciergeServices } = this.state;
      if(conciergeServices && conciergeServices.length > 0) {
        homeNavigator.instance.goTo('services', {
          title: 'Services',
          back: true
        })
      } else {
        Alert.alert('Error', 'The service is not available. Please try again later');
      }

    }

    gotoCreatePost = () => {
      // this.gotoFeed(false)
      setTimeout(() => {
          homeNavigator.instance.goTo(
              'newpost',
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
      if(this.props.conciergeServices) {
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
                        key={index}
                        style={styles.item}
                        index={item.label}
                        onPress={item.onPress}>
                        <View style={styles.iconContainer}>
                          {item.icon}
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

function bindAction(dispatch) {
  return {
    openDrawer: () => {
      Keyboard.dismiss();
      dispatch(openDrawer());
    },
    loadUserGroups: token => dispatch(loadUserGroups(token)),
    dispatch: a => dispatch(a),
    setGroup: (data, token, id) => dispatch(setGroup(data, token, id)),
    fetchConferences: token => dispatch(fetchConferences(token)),
    listServices: token => dispatch(listServices(token)),
  };
}

const mapStateToProps = state => ({
    token: state.user.token,
    conferences: state.conferences,
    conciergeServices: state.conciergeServices
});

export default connect(mapStateToProps, bindAction)(SimpleHomeScreen)
