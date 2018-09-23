# Powerline React Native App

Stabilized version of Powerline React Native App

  
## Setup

1. **Clone the repo**

  ```
  $ git clone https://github.com/PowerlineApp/powerline-rn.git
  $ cd powerline-rn
  ```

2. **Install dependencies** (npm v3+):
  - Install [Xopen](https://github.com/paulomendes/xopen)
  ```
  $ npm install
  $ react-native link
  $ cd ios && pod install
  $ xopen
  ```
  
3. **Running on Android**:

  ```
  $ react-native run-android
  $ adb reverse tcp:8081 tcp:8081   # required to ensure the Android app can
  $ adb reverse tcp:8080 tcp:8080   # access the Packager and GraphQL server
  ```


4. **Running on iOS:**

  ```
  $ react-native run-ios
  ```
  
5. **Build an APK:**

  ```
  $ npm start
  $ npm run bundle:android
  $ npm run build:android
  ```
