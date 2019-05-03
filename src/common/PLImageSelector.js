import React, { Component } from 'react';
import { TouchableOpacity, Modal, View, Text, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Icon, Thumbnail } from 'native-base';
const INITIAL_STATE = {
    showConfirmationModal: false,
    image: null
};
class PLImageSelector extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.selectImage = this.selectImage.bind(this);
        this.onModalConfirm = this.onModalConfirm.bind(this);
        this.onModalCancel = this.onModalCancel.bind(this);
    } 
    
    selectImage () {
        ImagePicker.openPicker({
            width: 1080,
            height: 1080,
            cropping: true,
            includeBase64: true
        }).then(image => {
            this.setState({
                showConfirmationModal: true,
                image
            });
        }).catch(err => {
            this.props.onError(err);
        });
    }

    onModalConfirm() {
        this.setState({showConfirmationModal: false});
        this.props.onConfirm(this.state.image);
    }

    onModalCancel() {
        this.setState(INITIAL_STATE);
    }

    render() {
        return (
            <TouchableOpacity transparent onPress={this.selectImage}>
                {/* <Icon name='camera'  /> */}
                <View style={styles.imageContainer}>
                    <Thumbnail source={{uri: this.props.image}} square />
                    <View style={styles.iconContainer}>
                        <Icon name={this.props.icon || 'camera'} style={{
                            color: this.props.iconColor,
                            backgroundColor: 'rgba(0,0,0,0)',
                            fontSize: this.props.iconSize
                        }} />
                    </View>
                </View>
                <Modal visible={this.state.showConfirmationModal} presentationStyle='pageSheet' transparent>
                    <View style={styles.confirmationContainer}>
                        <View style={styles.confirmationContent}>
                            <Image source={{uri: (this.state.image ? `data:${this.state.image.mime};base64,${this.state.image.data}` : null )}} style={styles.confirmationImage} />
                            <View style={styles.buttonsWrapper}>
                                <TouchableOpacity style={styles.button} onPress={this.onModalConfirm}>
                                    <Text style={styles.buttonText}>Confirm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, {backgroundColor: 'red'}]} onPress={this.onModalCancel}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
        );
    }
}

export default PLImageSelector;

const styles = {
    confirmationContainer: {
        height: '85%', width: '95%', alignSelf: 'center', marginTop: 5
    },
    confirmationImage: {
        flex: 1,
        margin: 16
    },
    confirmationContainer: {
        flex: 1,
        backgroundColor: rgb(0,0,0,0.7),
        alignItems: 'center',
        justifyContent: 'center'
    },
    confirmationContent: {
        height: '60%',
        width: '90%', 
        backgroundColor: '#fff'
    },
    imageContainer: {
        height: '100%',
        // minHeight: 60,
        minWidth: 60,
        width: '100%'
    },
    iconContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#020860',
        height: 30,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        borderRadius: 4
    },
    buttonText: {
        fontSize: 15,
        color: 'white'
    },
    buttonsWrapper: {
        flexDirection: 'row',
        height: 30,
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 10
    }
};