import React, {Component} from 'react';
import { connect } from 'react-redux';

import {View, Text, TouchableHighlight} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { Button, Icon, Left, CardItem, Label } from 'native-base';
import styles from '../styles';
import { votePost, loadActivityByEntityId, signUserPetition, unsignUserPetition, signLeaderPetition, undoVotePost, markAsRead } from 'PLActions';
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
        let originalItem = _.cloneDeep(this.state.item);
        let newItem = _.cloneDeep(this.state.item);

        const { profile, token } = this.props;
        console.log('\n before --- \n votes: ',newItem.votes && newItem.vote, '\n upvotes: ', newItem.upvotes_count, '\n downvotes: ' , newItem.downvotes_count, '----------');
        
        // user shouldn't vote his own post
        if (profile.id === item.user.id) {
            alert("You're not supposed to vote on your own Post.");
            return;
        }
        // console.log(item, option);
        // if (this.state.postingVote) {
        //     console.log('posting already!');
        //     return;
        // }
        // uses this state to avoid double clicking, the user is allowed to vote again only when the last request is done
        this.setState({postingVote: true});
        let undo = false;
        console.log(newItem, option);
        if (option === 'upvote') {
            if (!newItem.vote) {
            // didnt have any option checked
                console.log(2);
                newItem.vote = {option :'upvote'};
                newItem.upvotes_count += 1;
            } else {
                // user is unsetting his vote
                if (newItem.vote.option === "upvote") {
                    console.log(3);
                    newItem.vote.option = "" ; //[0].option = null;
                    newItem.upvotes_count -= 1;
                    undo = true;
                } else {
                    // user is setting his vote to up, had the down up checked
                    if (newItem.vote.option === "downvote") {
                        console.log(4);
                        newItem.vote = {option: 'upvote'};
                        newItem.upvotes_count += 1;
                        newItem.downvotes_count -= 1;
                    } else {
                        console.log('LIMBOO')
                        newItem.vote = {option: 'upvote'};
                        newItem.upvotes_count += 1;
                    }
                }
            }
        } else if (option === 'downvote') {
            if (!newItem.vote) {
                console.log(5);
                // didnt have any option checked
                newItem.vote = {option : "downvote"};
                newItem.downvotes_count += 1;
            } else {
                // user is unsetting his vote
                if (newItem.vote.option === "downvote") {
                    console.log(6);
                    newItem.vote.option = ""; // [0].option = null;
                    newItem.downvotes_count -= 1;
                    undo = true;
                } else {
                    // user is setting his vote to down, had the option up checked
                    if (newItem.vote.option === "upvote") {
                        console.log(7);
                        newItem.vote = {option: "downvote"};
                        newItem.upvotes_count -= 1;
                        newItem.downvotes_count += 1;
                    } else {
                        console.log('limbo!!!!')
                        newItem.vote = {option: "downvote"};
                        newItem.downvotes_count += 1;
                    }
                }
            }
        }

        console.log('\n after --- \n votes: ',newItem.vote, '\n upvotes: ', newItem.upvotes_count, '\n downvotes: ' , newItem.downvotes_count, '----------');
        this.setState({
            item: {...newItem,
                downvotes_count: newItem.downvotes_count < 0 ? 0 : newItem.downvotes_count,
                upvotes_count: newItem.upvotes_count < 0 ? 0 : newItem.upvotes_count,
            }});


        let response;
        try {
            if (undo) {
                response = await undoVotePost(this.props.token, item.id);
                console.log('response', response);
            } else {
                response = await votePost(this.props.token, item.id, option);
                console.log('response', response);
                if (response.status === 200) {
                    if (option === 'upvote') {
                        showToast('Upvoted');
                    }
                    if (option === 'downvote') {
                        showToast('Downvoted');
                    }
                }
            }
        } catch (error) {
            console.log('Failure on voting. was undoing? ', undo, error);
            this.setState({item: originalItem});
            
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
        // avoid double tapping until the response comes
        // user shouldn't sign his own petition
        if (profile.id === item.user.id) {
            alert("You're not supposed to sign your own Petition.");
            return;
        }
        if (this.state.signing) {
            return;
        }
        let entity;
        if (item.type === 'user-petition'){
            if (signed) item.user_petition.signatures = [{option_id : 2}];  
            else item.user_petition.signatures = [{option_id : 1}];
            this.setState({item: item});
            entity = 'petition';
        } else {
            if (signed) item.answers = [{option_id : 2}];
            else item.answers = [{option_id : 1}];
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
        } catch (error) {
            console.log(error);
            this.setState({item: item, signing: false});
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
        } catch (error) {
            console.log(error);
            this.setState({item: originalItem, signing: false});
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
        return <CardItem footer style={{ height: 35 }}>
            <Left style={{ justifyContent: 'space-between' }}>
                <TouchableHighlight onPress={() => {this.redirect(item, null, 'analyticsView'); Mixpanel.track("Viewed Post Analytics");}}>
                    <View style={{flexDirection: 'row', width: 50, justifyContent: 'space-around'}}>
                        {this._renderZoneIcon(item)}
                        <Label style={styles.commentCount}>{item.responses_count}</Label>
                    </View>
                </TouchableHighlight>
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
                <CardItem footer style={{ height: 35 }}>
                    <Left style={{ justifyContent: 'space-between' }}>
                        <AnimatedButton onPress={() => { this.vote(item, 'upvote'); Mixpanel.track("Upvoted post"); }} 
                            iconName={'md-arrow-dropup'} 
                            label={'Upvote ' + (item.upvotes_count ? item.upvotes_count : 0)}
                            labelStyle={isVotedUp ? styles.footerTextBlue : styles.footerText}
                            animateEffect={'tada'}
                            />

                        <AnimatedButton onPress={() => { this.vote(item, 'downvote'); Mixpanel.track("Downvoted post"); }} 
                            iconName={'md-arrow-dropdown'} 
                            label={'Downvote ' + (item.downvotes_count ? item.downvotes_count : 0)}
                            labelStyle={isVotedDown ? styles.footerTextBlue : styles.footerText}
                            animateEffect={'shake'}
                        />
                        {
                            this.props.isInDetail &&
                            <Button iconLeft transparent style={styles.footerButton} onPress={() => {this.redirect(item, null, 'analyticsView'); Mixpanel.track("Viewed Post Analytics");}} >
                                <Icon active name='pulse' style={styles.footerIcon} />
                                <Label style={styles.footerText} >
                                    {'Analytics '}
                                </Label>
                            </Button>
                        }
                        {!this.props.isInDetail && this.ReplyButton({item})}
                    </Left>
                </CardItem>
            );
        }
    }

    _renderUserPetitionFooter (item, showAnalytics) {
        // console.log(item.type ? item.type : '==================');
        // console.log(item);
        // console.log(item.type, item.body)
        let isSigned = false;     // (item.user_petition.signatures[0] ? item.user_petition.signatures[0].option_id : 2) === 1;
        if (
            item && item.user_petition &&
            item.user_petition.signatures && item.user_petition.signatures[0]
        ) {
            let vote = item.user_petition.signatures[0];
            // console.log('vote', vote);
            if (vote.option_id === 1) {
                isSigned = true;
            }
        }

        // console.log(item.body, isSigned)
        // if (this.state.signing){
        //     isSigned = !isSigned;
        // }
        // console.log('got here, signed ? ', isSigned);
        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-between' }}>
                    <AnimatedButton onPress={() => {this.sign(item, isSigned); Mixpanel.track("Signed Petition");}}
                        iconName={'md-arrow-dropdown'} 
                        label={isSigned ? 'Unsign' : 'Sign'}
                        animateEffect={'tada'}
                    />
                    {/* <Button iconLeft transparent style={styles.footerButton} onPress={() => {this.sign(item, isSigned); Mixpanel.track("Signed Petition");}} >
                        <Icon name='md-arrow-dropdown' style={styles.footerIcon} />
                        <Label style={styles.footerText} > { isSigned ? 'Unsign' : 'Sign'}</Label>
                    </Button> */}
                    {
                        this.props.isInDetail &&
                        <Button iconLeft transparent style={styles.footerButton} onPress={() => {this.redirect(item, null, 'analyticsView'); Mixpanel.track("Viewed Petition Analytics");}}>
                            <Icon active name='pulse' style={styles.footerIcon} />
                            <Label style={styles.footerText} >
                                {'Analytics '}
                            </Label>
                        </Button>
                    }
                    {!this.props.isInDetail && this.ReplyButton({item})}
                    {/* <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item, {commenting: true})} >
                        <Icon active name='ios-undo' style={styles.footerIcon} />
                        <Label style={styles.footerText} >
                            {'Reply '}
                            {item.comments_count ? item.comments_count : 0}
                        </Label>
                    </Button> */}
                </Left>
            </CardItem>
        );
    }
    _renderLeaderPetitionFooter (item) {
        console.log(item);
        let isSigned = false;
        let options = item.options;
        let signOptionIndex = item.options.findIndex(opt => opt.value === 'Sign');
        let unsignOptionIndex = signOptionIndex === 0 ? 1 : 0;
        console.log(signOptionIndex, item.answer, item.options)

        if (item.answer && item.options[signOptionIndex].id == item.answer.option){
            isSigned = true;
        }
        console.log('signed', isSigned, (item.options[signOptionIndex] || {}).id, (item.answer || {}).option)
        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-between' }}>
                    <Button iconLeft transparent style={styles.footerButton} onPress={() => this.signLeaderPetition(item, isSigned, item.options[signOptionIndex].id, item.options[unsignOptionIndex].id)}>
                        <Icon name='md-arrow-dropdown' style={styles.footerIcon} />
                        <Label style={styles.footerText} > {isSigned ? 'Unsign' : 'Sign'}</Label>
                    </Button>
                    {!this.props.isInDetail && this.ReplyButton({item})}
                    {/* <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item, {commenting: true})} >
                        <Icon active name='ios-undo' style={styles.footerIcon} />
                        <Label style={styles.footerText} >
                            {'Reply '}
                            {item.comments_count ? item.comments_count : 0}
                        </Label>
                    </Button> */}
                </Left>
            </CardItem>
        );
    }

    _renderQuestionFooter (item) {
        // console.log(item.type ? item.type : '==================');

        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-between' }}>
                    <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item)} >
                        <Icon name='md-arrow-dropdown' style={styles.footerIcon} />
                        <Label style={styles.footerText}>Answer</Label>
                    </Button>
                    {!this.props.isInDetail && this.ReplyButton({item})}
                    {/* <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item, {commenting: true})} >
                        <Icon active name='ios-undo' style={styles.footerIcon} />
                        <Label style={styles.footerText} >
                            {'Reply '}
                            {item.comments_count ? item.comments_count : 0}
                        </Label>
                    </Button> */}
                </Left>
            </CardItem>
        );
    }

    _renderPaymentRequestFooter (item) {
        // console.log(item.type ? item.type : '==================');

        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-between' }}>
                    <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item)} >
                        <Icon name='md-arrow-dropdown' style={styles.footerIcon} />
                        <Label style={styles.footerText}>Pay</Label>
                    </Button>
                    {!this.props.isInDetail && this.ReplyButton({item})}
                    {/* <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item, {commenting: true})} >
                        <Icon active name='ios-undo' style={styles.footerIcon} />
                        <Label style={styles.footerText} >
                            {'Reply '}
                            {item.comments_count ? item.comments_count : 0}
                        </Label>
                    </Button> */}
                </Left>
            </CardItem>
        );
    }

    _renderLeaderEventFooter (item) {
        // console.log(item.type ? item.type : '==================');
        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-between' }}>
                    <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item)} >
                        <Icon name='md-arrow-dropdown' style={styles.footerIcon} />
                        <Label style={styles.footerText}>RSVP</Label>
                    </Button>
                    {!this.props.isInDetail && this.ReplyButton({item})}
                    {/* <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item, {commenting: true})} >
                        <Icon active name='ios-undo' style={styles.footerIcon} />
                        <Label style={styles.footerText} >
                            {'Reply '}
                            {item.comments_count ? item.comments_count : 0}
                        </Label>
                    </Button> */}
                </Left>
            </CardItem>
        );
    }

    _renderLeadNewsFooter (item) {
        // console.log(item.type ? item.type : '==================');

        // console.log(item.body);
        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-between' }}>
                    <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item, {commenting: true})} >
                        <Icon name='md-arrow-dropdown' style={styles.footerIcon} />
                        <Label style={styles.footerText}>Discuss</Label>
                    </Button>
                    {!this.props.isInDetail && this.ReplyButton({item})}
                    {/* <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item, {commenting: true})} >
                        <Icon active name='ios-undo' style={styles.footerIcon} />
                        <Label style={styles.footerText} >
                            {'Reply '}
                            {item.comments_count ? item.comments_count : 0}
                        </Label>
                    </Button> */}
                </Left>
            </CardItem>
        );
    }
    _renderFundraiserFooter (item) {
        return (
            <CardItem footer style={{ height: 35 }}>
                <Left style={{ justifyContent: 'space-between' }}>
                    <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item)} >
                        <Icon name='md-arrow-dropdown' style={styles.footerIcon} />
                        <Label style={styles.footerText}>Donate</Label>
                    </Button>
                    {!this.props.isInDetail && this.ReplyButton({item})}
                    {/* <Button iconLeft transparent style={styles.footerButton} onPress={() => this.redirect(item, {commenting: true})} >
                        <Icon active name='ios-undo' style={styles.footerIcon} />
                        <Label style={styles.footerText} >
                            {'Reply '}
                            {item.comments_count ? item.comments_count : 0}
                        </Label>
                    </Button> */}
                </Left>
            </CardItem>
        );
    }


    _renderDefaultFooter (item) {
        return null;
    }

    ReplyButton = ({item}) => 
        <AnimatedButton onPress={() => this.redirect(item, {commenting: true})}
            iconName={'ios-undo'} 
            label={'Reply '}
            animateEffect={'flash'}
        />;

    render () {
        let {item} = this.state;
        const showAnalytics = true;
        // console.log('item in state => ', item)
        let footer = null;
        switch (item.type) {
        case 'post':
            footer =  this._renderPostFooter(item, showAnalytics);
            break;
        case 'user-petition':
            footer =  this._renderUserPetitionFooter(item, false);
            break;
        case 'petition':
            footer =  this._renderLeaderPetitionFooter(item, false);
            break;
        case 'question':
            footer =  this._renderQuestionFooter(item, false);
            break;
        case 'crowdfunding-payment-request':
        case 'payment-request':
            footer = this._renderFundraiserFooter(item, false);
            break;
        case 'leader-event':
            footer =  this._renderLeaderEventFooter(item, false);
            break;
        case 'leader-news':
            footer =  this._renderLeadNewsFooter(item, false);
            break;
        default:
            footer =  null;
        }
        return (
            <View style={{backgroundColor: '#ff0'}} >
                {this.renderFirstRow(item)}
                <View style={styles.borderContainer} />
                {footer}
            </View>
        );
    }
}


export default connect(() => ({}), {markAsRead})(FeedFooter);
