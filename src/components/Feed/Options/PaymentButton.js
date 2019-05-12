import LinearGradient from "react-native-linear-gradient";
import Entypo from "react-native-vector-icons/Entypo";
import {Text} from "native-base";
import React from "react";
import SlideToUnlock from "../../SlideToUnlock";
import styles from './styles';

const borderGradient = ['#000066', '#555aa0'];
const backgroundGradient = ['#555aa0', '#000066'];
const sliderGradient = ['#fdfdfd', '#e2e2e2', '#686868'];

type Props = {
  content: string,
  onEndReached: Function,
}

export default (props: Props) => (
  <LinearGradient colors={borderGradient} style={styles.paymentButtonBorder}>
    <LinearGradient colors={backgroundGradient} style={styles.paymentButtonBackground}>
      <SlideToUnlock
        onEndReached={props.onEndReached}
        containerStyle={styles.paymentButtonContainer}
        sliderElement={
          <LinearGradient colors={sliderGradient} style={styles.paymentButtonSlider}>
            <Entypo name="arrow-right" size={42} color="#8c8c8c" style={styles.paymentButtonIcon} />
          </LinearGradient>
        }
      >
        <Text style={styles.paymentButtonText}>{props.content}</Text>
      </SlideToUnlock>
    </LinearGradient>
  </LinearGradient>
);
