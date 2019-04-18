import React, {Component} from 'react';
import { connect } from 'react-redux';

import {View, Text, TouchableHighlight} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { Button, Icon, Left, CardItem, Label, Thumbnail } from 'native-base';
import styles from '../styles';
import { votePost, updateActivity, loadActivityByEntityId, signUserPetition, unsignUserPetition, signLeaderPetition, undoVotePost, markAsRead } from 'PLActions';
import _ from 'lodash';
import { showToast } from 'PLToast';
import AnimatedButton from './animatedButton';

import {Mixpanel} from 'PLEnv';

class FeedFooter extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: false,
            item: this.props.item
        };
    }


    updateActivity(item) {
        this.setState({item});
        this.props.updateActivity(item);
    }

    redirect(item, options, scene = 'itemDetail') {
        console.log(item, item.body);
        let type;
        if (item.poll) {
            type = 'poll';
        } else if (item.post) {
            type = 'post';
        } else if (item.user_petition) {
            type = 'user-petition';
        }
        Actions[scene]({ entityType: item.type, entityId: item.id, ...options, postId: item.id, text: scene === 'analyticsView' ? item.body : null });
    }

    markAsRead(item){
        // poll/fundraiser/event is ANSWERED - marked as read
        if (item.read) return;
        if (item.zone === 'prioritized'){
            this.props.markAsRead(this.props.token, item.id);
        }
    }

    // changes the upvote/downvote color to indicate selection, sets the upvote/downvote number before the response comes. if the requisition fails, undo all
    async vote (item, option, cb) {
        // boosted/post and VOTED - marked as read
        this.markAsRead(item);


        // uses lodash.cloneDeep to avoid keeping references
        let originalItem = _.cloneDeep(this.state.item);
        let newItem = _.cloneDeep(this.state.item);

        const { profile, token } = this.props;
        console.log('\n before --- \n votes: ',newItem.votes && newItem.vote, '\n upvotes: ', newItem.upvotes_count, '\n downvotes: ' , newItem.downvotes_count, '----------');
        
        // user shouldn't vote his own post
        if (profile.id === item.owner.id) {
            alert("You're not supposed to vote on your own Post.");
            return;
        }
        this.setState({postingVote: true});
        let undo = false;
        console.log(newItem, option);
        if (option === 'upvote') {
            if (!newItem.vote) {
            // didnt have any option checked
                console.log(2);
                newItem.vote = {option :'upvote'};
                newItem.upvotes_count = Number(newItem.upvotes_count) + 1;
            } else {
                // user is unsetting his vote
                if (newItem.vote.option === "upvote") {
                    console.log(3);
                    newItem.vote.option = "" ; //[0].option = null;
                    newItem.upvotes_count = Number(newItem.upvotes_count) - 1;
                    undo = true;
                } else {
                    // user is setting his vote to up, had the down up checked
                    if (newItem.vote.option === "downvote") {
                        console.log(4);
                        newItem.vote = {option: 'upvote'};
                        newItem.upvotes_count = Number(newItem.upvotes_count) + 1;
                        newItem.downvotes_count = Number(newItem.downvotes_count) - 1;
                    } else {
                        console.log('LIMBOO');
                        newItem.vote = {option: 'upvote'};
                        newItem.upvotes_count = Number(newItem.upvotes_count) + 1;
                    }
                }
            }
        } else if (option === 'downvote') {
            if (!newItem.vote) {
                console.log(5);
                // didnt have any option checked
                newItem.vote = {option : "downvote"};
                newItem.downvotes_count = Number(newItem.downvotes_count) + 1;
            } else {
                // user is unsetting his vote
                if (newItem.vote.option === "downvote") {
                    console.log(6);
                    newItem.vote.option = ""; // [0].option = null;
                    newItem.downvotes_count = Number(newItem.downvotes_count) - 1;
                    undo = true;
                } else {
                    // user is setting his vote to down, had the option up checked
                    if (newItem.vote.option === "upvote") {
                        console.log(7);
                        newItem.vote = {option: "downvote"};
                        newItem.upvotes_count = Number(newItem.upvotes_count) - 1;
                        newItem.downvotes_count = Number(newItem.downvotes_count) + 1;
                    } else {
                        newItem.vote = {option: "downvote"};
                        newItem.downvotes_count = Number(newItem.downvotes_count) + 1;
                    }
                }
            }
        }

        // console.log('\n after --- \n votes: ',newItem.vote, '\n upvotes: ', newItem.upvotes_count, '\n downvotes: ' , newItem.downvotes_count, '----------');
        newItem = {...newItem,
            downvotes_count: newItem.downvotes_count < 0 ? 0 : newItem.downvotes_count,
            upvotes_count: newItem.upvotes_count < 0 ? 0 : newItem.upvotes_count,
        };
        
        this.setState({
            item: {...newItem,
                downvotes_count: newItem.downvotes_count < 0 ? 0 : newItem.downvotes_count,
                upvotes_count: newItem.upvotes_count < 0 ? 0 : newItem.upvotes_count,
            }});

        this.updateActivity({...newItem,
            downvotes_count: newItem.downvotes_count < 0 ? 0 : newItem.downvotes_count,
            upvotes_count: newItem.upvotes_count < 0 ? 0 : newItem.upvotes_count,
        });


        let response;
        try {
            if (undo) {
                response = await undoVotePost(this.props.token, item.id);
                console.log('response', response);
            } else {
                response = await votePost(this.props.token, item.id, option);
                console.log('response', response);
                if (response.status === 200) {
                    console.log('dispatching...', this.props);
                    // this.props.dispatch({type: 'UPDATE_ACTIVITY', payload: newItem})
                    this.updateActivity(newItem);

                    if (option === 'upvote') {
                        showToast('Upvoted');
                    }
                    if (option === 'downvote') {
                        showToast('Downvoted');
                    }
                } else {
                    let error = await response.json();
                    console.log(error);
                    showToast(error.errors.errors[0]);
                    this.updateActivity(originalItem);
                }
            }
        } catch (error) {
            console.log('Failure on voting. was undoing? ', undo, error);
            this.updateActivity(originalItem);
            
        }
        this.setState({postingVote: false});
    }

    /**
     * 
     * @param {*} item the item to be signed/unsigned
     * @param {*} signed tells us if the item is already signed
     */
    async sign (item, signed, cb) {
        const { profile, token } = this.props;
        let originalItem = _.cloneDeep(item);
        let copyItem = _.cloneDeep(item);
        // if (!item.answer){
        //     item.answer = {};
        // }

        // console.log('profile, item.user', profile, item.user);
        // avoid double tapping until the response comes
        // user shouldn't sign his own petition
        // if (Number(profile.id) === Number(item.user.id)) {
        //     alert("You're not supposed to sign your own Petition.");
        //     return;
        // }

        copyItem.responses_count = Number(copyItem.responses_count);

        if (this.state.signing) {
            return;
        }
        this.setState({signing: true});
        let entity;
        if (signed){
            copyItem.signature.id = null;
            copyItem.responses_count -=1;
            copyItem.isSigned = false;
        }
        else {
            copyItem.signature ={id: 1};
            copyItem.responses_count +=1;
            copyItem.isSigned = true;
        }
        // this.updateActivity({...copyItem});
        console.log('props', this.props);
        this.updateActivity(copyItem);

        entity = 'petition';


        let res;
        try {
            if (signed){
                res = await unsignUserPetition(token, item.id);
            } else {
                res = await signUserPetition(token, item.id);
            }
            this.setState({signing: false});
        } catch (error) {
            this.updateActivity(originalItem);
            this.setState({signing: false});
        }
    }


    async signLeaderPetition(item, signed, signId, unsignId){
        const { profile, token } = this.props;
        let originalItem = _.cloneDeep(item);
        if (this.state.signing) {
            return;
        }
        this.setState({signing: true});
        console.log(signId, unsignId);
        let option = signed ? unsignId : signId;
        item.answer_count = Number(item.answer_count);

        item.answer = {option};
        if (signed){
            item.answer_count -=1;
        } else {
            item.answer_count +=1;
        }
        let res;
        try {
            res = await signLeaderPetition(token, item.id, option);
            this.setState({signing: false, item});
            this.updateActivity(item);
        } catch (error) {
            console.log(error);
            this.updateActivity(originalItem);
            this.setState({signing: false});
        }
    }

    // on this one we need this to control upvote / downvote before a response comes from the API
    _renderPostFooter (item, showAnalytics) {
        // console.log(item);
        let isVotedDown = false;
        let isVotedUp = false;
        if (
            item &&
            item.vote
        ) {
            let vote = item.vote.option;
            isVotedUp = vote === 'upvote';
            isVotedDown = vote === 'downvote';
        }
        // console.log(item.body, isVotedUp)
        return (
            // <CardItem footer style={{ height: 35, padding: 0, backgroundColor: '#f0f' }}>
            <View footer style={{flexDirection: 'row', paddingLeft: 4, justifyContent: 'space-between', alignItems: 'center', flex: 1, height: 35 }}>
                <View style={{flex: 6, flexDirection: 'row'}}>
                    <View style={{flex: 3}}>
                        <AnimatedButton onPress={() => { this.vote(item, 'upvote'); Mixpanel.track("Upvoted post"); }}
                            iconName={'md-arrow-dropup'}
                            label={'Upvote ' + (item.upvotes_count || 0)}
                            labelStyle={isVotedUp ? styles.footerTextBlue : styles.footerText}
                            animateEffect={'tada'}
                        />
                    </View>

                    <View style={{flex: 3}}>
                        <AnimatedButton onPress={() => { this.vote(item, 'downvote'); Mixpanel.track("Downvoted post"); }}
                            iconName={'md-arrow-dropdown'}
                            label={'Downvote ' + (item.downvotes_count || 0)}
                            labelStyle={isVotedDown ? styles.footerTextBlue : styles.footerText}
                            animateEffect={'shake'}
                        />

                    </View>
                </View>
                {this.renderPulseIcon(item, 2, true)}
                {this.renderCommentIcon(item, 2)}
            </View>
            // </CardItem>
        );
    }

    _renderUserPetitionFooter (item, showAnalytics) {
        // let isSigned = false;
        const isSigned = item && item.signature && item.signature.id;
        console.log('isSigned', this.props.isInDetail, isSigned, item.signature);
        // if (
        //     item &&
        //     item.signature
        // ) {
        //     let vote = item.signature;
        //     if (vote.id) {
        //         isSigned = true;
        //     }
        // }

        // console.log(item);


        return (
            // <CardItem fo oter style={{ height: 35 }}>
            <View footer style={{flexDirection: 'row', paddingLeft: 4, justifyContent: 'space-between', alignItems: 'center', flex: 1, height: 35 }}>
                <View style={{flex: 6, flexDirection: 'row'}}>
                    <AnimatedButton onPress={() => {this.sign(item, isSigned); Mixpanel.track("Signed Petition");}}
                        icon={<Thumbnail source={require('../../../assets/petition-icon.png')} style={{height: 25, width: 25, tintColor: isSigned ? '#53a8cd' : '#8694ab'}} square />}
                        label={isSigned ? ' Signed' : ('  ' + (item.responses_count || 0) + ' Signatures')}
                        labelStyle={isSigned ? styles.footerTextBlue : styles.footerText}
                        animateEffect={'tada'}
                        />
                </View>
                {this.renderPulseIcon(item, 2)}
                {this.renderCommentIcon(item, 2)}
            </View>
            // </CardItem>
        );
    }
    _renderLeaderPetitionFooter (item) {
        let isSigned = false;
        let options = item.options;
        let signOptionIndex = item.options.findIndex(opt => opt.value === 'Sign');
        let unsignOptionIndex = signOptionIndex === 0 ? 1 : 0;
        let signOption = item.options[signOptionIndex];
        let unsignOption = item.options[unsignOptionIndex];
        if (item.answer && (item.options[signOptionIndex].id || {}) === item.answer.option){
            isSigned = true;
        }
        return (
            // <CardItem footer style={{ height: 35 }}>
            <View footer style={{flexDirection: 'row', paddingLeft: 4, justifyContent: 'space-between', alignItems: 'center', flex: 1, height: 35 }}>
                <View style={{flex: 6, flexDirection: 'row'}}>
                    <AnimatedButton onPress={() => {this.signLeaderPetition(item, isSigned, signOption.id, unsignOption.id); Mixpanel.track("Signed Petition");}}
                        icon={<Thumbnail source={require('../../../assets/petition-icon.png')} style={{height: 25, width: 25, tintColor: isSigned ? '#53a8cd' : '#8694ab'}} square />}
                        label={isSigned ? ' Signed' : ('  ' + (item.answer_count || 0) + ' Signatures')}
                        labelStyle={isSigned ? styles.footerTextBlue : styles.footerText}
                        animateEffect={'tada'}
                            />
                </View>
                {this.renderPulseIcon(item, 2)}
                {this.renderCommentIcon(item, 2)}
            </View>
            // </CardItem>
        );
    }

    _renderPollFooter (item, iconName, text) {
        return( 
        // <CardItem footer style={{ height: 35 }}>
            <View footer style={{flexDirection: 'row', paddingLeft: 4, justifyContent: 'space-between', alignItems: 'center', flex: 1, height: 35 }}>
                <View style={{flex: 6, flexDirection: 'row'}}>
                    <TouchableHighlight style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} underlayColor='#fff' onPress={() => !this.props.isInDetail && this.redirect(item)}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}} >
                            <Icon active name={iconName} style={styles.footerIcon} />
                            <Label style={styles.footerText}>
                                {text}
                            </Label>
                        </View>
                    </TouchableHighlight>
                </View>
                {this.renderPulseIcon(item, 2)}
                {this.renderCommentIcon(item, 2)}
            </View>);
        // </CardItem>;
    }

    renderPulseIcon(item, flex, link){
        console.log(item.type, 'counting: ', ' comment: ', item.comment_count, ' answer: ', item.answer_count,' responses:', item.responses_count);
        const activity = Number((item.comment_count || 0)) 
        + Number((item.answer_count || 0)) 
        + ((item.type === 'petition' || item.type === 'user-petition' || item.type === 'post') ? Number((item.responses_count || 0)) : 0); 


        return <View style={{flex: flex || 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button iconLeft transparent style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}} onPress={() => {link && this.redirect(item, null, 'analyticsView'); Mixpanel.track("Viewed Petition Analytics");}}>
                <Icon active name='pulse' style={styles.footerIcon} />
                <Label style={styles.footerText} >
                    {activity}
                </Label>
            </Button>
        </View>;
    }

    renderCommentIcon(item, flex){
        return <View style={{ flex: flex || 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
            <Button iconLeft transparent style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}} onPress={() => {
                !this.props.isInDetail && this.redirect(item, {commenting: true}); Mixpanel.track("Viewed Petition Analytics");}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon active name='ios-text' style={styles.footerIcon} />
                    <Label style={styles.footerText}>
                        {item.comment_count || 0}
                    </Label>
                </View>
            </Button>
        </View>;
    }

    render () {
        let {item} = this.state;
        const showAnalytics = true;
        let footer = null;
        switch (item.type) {
        case 'post':
            footer =  this._renderPostFooter(item, showAnalytics);
            break;
        case 'user-petition':
            footer =  this._renderUserPetitionFooter(item);
            break;
        case 'petition':
            footer =  this._renderLeaderPetitionFooter(item);
            break;
        case 'poll':
            footer =  this._renderPollFooter(item, 'ios-stats', 'Answer', true, true);
            break;
        case 'crowdfunding-payment-request':
        case 'payment-request':
            footer = this._renderPollFooter(item, 'ios-cash', 'Donate', false, true);
            break;
        case 'leader-event':
            footer =  this._renderPollFooter(item, 'ios-calendar', 'RSVP', false, true);
            break;
        case 'leader-news':
            footer =  this._renderPollFooter(item, 'ios-chatbubbles', 'Discuss', false, true);
            break;
        default:
            footer =  this._renderPollFooter(item);
        }

        return (
            <View style={{bottom: 0, marginHorizontal: 8, width: '100%', position: 'absolute'}}>
                {footer}
            </View>
        );
    }
}


export default connect(() => ({}), {markAsRead, updateActivity})(FeedFooter);
