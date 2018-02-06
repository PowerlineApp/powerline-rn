import React, {Component} from 'react';
import { connect } from 'react-redux';

import {View, Text, TouchableHighlight} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { Button, Icon, Left, CardItem, Label, Thumbnail } from 'native-base';
import styles from '../styles';
import { votePost,updateActivity, loadActivityByEntityId, signUserPetition, unsignUserPetition, signLeaderPetition, undoVotePost, markAsRead } from 'PLActions';
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

    redirect(item, options, scene = 'itemDetail') {
        console.log(item, item.body)
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
        let originalItem = _.cloneDeep(this.props.item);
        let newItem = _.cloneDeep(this.props.item);

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
                        console.log('LIMBOO')
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
                        console.log('limbo!!!!')
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

        this.props.updateActivity({...newItem,
            downvotes_count: newItem.downvotes_count < 0 ? 0 : newItem.downvotes_count,
            upvotes_count: newItem.upvotes_count < 0 ? 0 : newItem.upvotes_count,
        })


        let response;
        try {
            if (undo) {
                response = await undoVotePost(this.props.token, item.id);
                console.log('response', response);
            } else {
                response = await votePost(this.props.token, item.id, option);
                console.log('response', response);
                if (response.status === 200) {
                    console.log('dispatching...', this.props)
                    // this.props.dispatch({type: 'UPDATE_ACTIVITY', payload: newItem})
                    this.props.updateActivity(newItem);

                    if (option === 'upvote') {
                        showToast('Upvoted');
                    }
                    if (option === 'downvote') {
                        showToast('Downvoted');
                    }
                } else {
                    let error = await response.json();
                    console.log(error)
                    showToast(error.errors.errors[0])
                    this.props.updateActivity(originalItem);
                }
            }
        } catch (error) {
            console.log('Failure on voting. was undoing? ', undo, error);
            this.props.updateActivity(originalItem);
            
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
        if (!item.answer){
            item.answer = {};
        }

        console.log(profile, item.user)
        // avoid double tapping until the response comes
        // user shouldn't sign his own petition
        if (Number(profile.id) === Number(item.user.id)) {
            alert("You're not supposed to sign your own Petition.");
            return;
        }
        if (this.state.signing) {
            return;
        }
        let entity;
        if (item.type === 'user-petition'){
            if (signed) item.signature.id = null;  
            else item.signature ={id: 1};
            this.setState({item: item});
            entity = 'petition';
        } else {
            if (signed) item.answer.option_id = 2;
            else item.answer.option_id = 1;
            this.setState({item: item});
            entity = 'poll';
        }
        let res;
        this.setState({signing: true});
        try {
            if (entity === 'petition') {
                if (signed){
                    res = await unsignUserPetition(token, item.id);
                } else {
                    res = await signUserPetition(token, item.id);
                }
            } else {
                res = await signLeaderPetition(token, item.id, signed ? 2 : 1);
            }
            this.setState({signing: false});
            // this.props.dispatch({type: 'UPDATE_ACTIVITY', payload: item})
            this.props.updateActivity(item);
        } catch (error) {
            console.log(error);
            this.props.updateActivity(originalItem);
            this.setState({signing: false});
        }
    }


    async signLeaderPetition(item, signed, signId, unsignId){
        const { profile, token } = this.props;
        let originalItem = _.cloneDeep(item);
        if (this.state.signing) {
            return;
        }
        console.log(signId, unsignId)
        let option = signed ? unsignId : signId;
        item.answer = {option};
        let res;
        this.setState({signing: true});
        try {
            res = await signLeaderPetition(token, item.id, option);
            this.setState({signing: false, item});
            this.props.updateActivity(item)
        } catch (error) {
            console.log(error);
            this.props.updateActivity(originalItem)
            this.setState({signing: false});
        }
    }

    _renderZoneIcon(item) {
        if (item.zone === 'prioritized') {
          return (<Icon active name='ios-flash' style={styles.zoneIcon} />);
        } else {
          return null;
        }
      }

    renderFirstRow(item){
        return null;
        return <CardItem footer style={{ marginTop: -40, flexDirection: 'row', height: 35, width: '100%', backgroundColor: '#fff', position: 'absolute' }}>
            <Left style={{ justifyContent: 'space-between' }}>
                {/* <TouchableHighlight onPress={() => {this.redirect(item, null, 'analyticsView'); Mixpanel.track("Viewed Post Analytics");}}>
                    <View style={{flexDirection: 'row', width: 50, justifyContent: 'space-around'}}>
                        {this._renderZoneIcon(item)}
                        <Label style={styles.commentCount}>{item.responses_count}</Label>
                    </View>
                </TouchableHighlight> */}
                <Text onPress={() => this.redirect(item)} style={styles.footerText}>{item.comments_count ? item.comments_count : 0} comments</Text>
            </Left>
        </CardItem>
    }

    // on this one we need this to control upvote / downvote before a response comes from the API
    _renderPostFooter (item, showAnalytics) {
        // console.log(item);
        if (item.zone === 'expired') {
            return (
                <CardItem footer style={{ height: 35 }}>
                    <Left style={{ justifyContent: 'space-between' }}>
                        {this.ReplyButton({item})}
                    </Left>
                </CardItem>
            );
        } else {
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
                <View footer style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, height: 35 }}>
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
                            {/* <View style={{flex: this.props.isInDetail ? 1.8 : 2.4}}> */}
                            {/* <TouchableHighlight iconLeft transparent small style={styles.footerButton} onPress={() => {this.props.isInDetail && this.redirect(item, null, 'analyticsView'); Mixpanel.track("Viewed Post Analytics");}} >
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon active name='pulse' style={styles.footerIcon} />
                                    <Label style={styles.footerText} >
                                        {item.responses_count || 0}
                                    </Label>
                                </View>
                            </TouchableHighlight> */}
                        {/* </View>  */}
                        {this.renderPulseIcon(item, 2)}
                        {
                            this.renderCommentIcon(item, 2)
                        }
                </View>
            );
        }
    }

    _renderUserPetitionFooter (item, showAnalytics) {
      let isSigned = false;
        if (
            item &&
            item.signature
        ) {
            let vote = item.signature;
            if (vote.id) {
                isSigned = true;
            }
        }
        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-around' }}>
                    <View style={{flex: 1}}>
                    <AnimatedButton onPress={() => {this.sign(item, isSigned); Mixpanel.track("Signed Petition");}}
                        icon={<Thumbnail source={require('../../../assets/petition-icon.png')} style={{height: 25, width: 25, tintColor: isSigned ? '#53a8cd' : '#8694ab'}} square />}
                        label={isSigned ? ' Signed' : ('  ' + (item.answer_count || 0) + ' Signatures') }
                        labelStyle={isSigned ? styles.footerTextBlue : styles.footerText}
                        animateEffect={'tada'}
                        />
                    </View>
                    {this.renderPulseIcon(item, 0.8)}
                    {this.renderCommentIcon(item, 0.1)}
                </Left>
            </CardItem>
        );
    }
    _renderLeaderPetitionFooter (item) {
        let isSigned = false;
        let options = item.options;
        let signOptionIndex = item.options.findIndex(opt => opt.value === 'Sign');
        let unsignOptionIndex = signOptionIndex === 0 ? 1 : 0;
        let signOption = item.options[signOptionIndex];
        let unsignOption = item.options[unsignOptionIndex];
        if (item.answer && (item.options[signOptionIndex].id || {}) == item.answer.option){
            isSigned = true;
        }
        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-around' }}>
                    <View style={{flex: 1}}>
                        <AnimatedButton onPress={() => {this.signLeaderPetition(item, isSigned, signOption.id, unsignOption.id); Mixpanel.track("Signed Petition");}}
                            icon={<Thumbnail source={require('../../../assets/petition-icon.png')} style={{height: 25, width: 25, tintColor: isSigned ? '#53a8cd' : '#8694ab'}} square />}
                            label={isSigned ? ' Signed' : ('  ' + (item.answer_count || 0) + ' Signatures') }
                            labelStyle={isSigned ? styles.footerTextBlue : styles.footerText}
                            animateEffect={'tada'}
                            />
                    </View>
                    {this.renderPulseIcon(item, 0.8)}
                    {this.renderCommentIcon(item, 0.1)}
                </Left>
            </CardItem>
        );
    }

    _renderPollFooter (item, iconName, text, analytics, comments) {
        return <CardItem footer style={{ height: 35 }}>
        <Left style={{ justifyContent: 'space-between' }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Icon active name={iconName} style={styles.footerIcon} />
                <Label style={styles.footerText}>
                    {text}
                </Label>
            </View>
                {this.renderPulseIcon(item, 0.8, true)}
                {this.renderCommentIcon(item, 0.1)}
        </Left>
    </CardItem>
    }

    renderPulseIcon(item, flex, notLink){
        return <View style={{flex: flex || 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Button iconLeft transparent style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}} onPress={() => {!notLink && this.props.isInDetail && this.redirect(item, null, 'analyticsView'); Mixpanel.track("Viewed Petition Analytics");}}>
                        <Icon active name='pulse' style={styles.footerIcon} />
                        <Label style={styles.footerText} >
                            {item.responses_count || 0}
                        </Label>
                    </Button>
                </View>
    }

    renderCommentIcon(item, flex){
        return <View style={{ flex: flex || 1, backgroundColor: '#fff'}}>
                    <Button iconLeft transparent style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}} onPress={() => {
                        this.props.isInDetail && this.redirect(item, null, 'analyticsView'); Mixpanel.track("Viewed Petition Analytics");}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <Icon active name='ios-text' style={styles.footerIcon} />
                <Label style={styles.footerText}>
                {item.comment_count || 0}
                </Label>
            </View>
    </Button>
    </View>
    }

    ReplyButton = ({item}) => null
        // <AnimatedButton onPress={() => this.redirect(item, {commenting: true})}
        //     iconName={'ios-undo'} 
        //     label={'Reply '}
        //     animateEffect={'flash'}
        // />;
    render () {
    //  return null;
        let {item} = this.props;
        const showAnalytics = true;
        // console.log('item in state => ', item)
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
