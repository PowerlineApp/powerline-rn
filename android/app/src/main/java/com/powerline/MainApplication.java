package com.powerline;

import android.app.Application;

import com.facebook.react.ReactInstanceManager;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.gettipsi.stripe.StripeReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import cl.json.RNSharePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.alinz.parkerdan.shareextension.SharePackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;

import io.fabric.sdk.android.Fabric;
import java.util.Arrays;
import java.util.List;

import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.BV.LinearGradient.LinearGradientPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected  static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
            new StripeReactPackage(),
            new VectorIconsPackage(),
            new PickerPackage(),
            new RNSharePackage(),
            new RNFetchBlobPackage(),
        new RNDeviceInfo(),
        new ReactNativeOneSignalPackage(),
        new SharePackage(),
        new ReactNativeYouTube(),
        new FBSDKPackage(mCallbackManager),
        new SplashScreenReactPackage(),
        new LinearGradientPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
