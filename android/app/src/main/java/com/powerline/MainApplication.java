package com.powerline;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.gettipsi.stripe.StripeReactPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.oblador.vectoricons.VectorIconsPackage;
import com.github.alinz.rnsk.RNSKPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.alinz.parkerdan.shareextension.SharePackage;
import cl.json.RNSharePackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.vonovak.AddCalendarEventPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

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
            new ReactNativeYouTube(),
            new VectorIconsPackage(),
            new RNSKPackage(),
            new SplashScreenReactPackage(),
            new SharePackage(),
            new RNSharePackage(),
            new ReactNativeOneSignalPackage(),
            new RNMixpanel(),
            new LinearGradientPackage(),
            new PickerPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new FBSDKPackage(),
            new RNDeviceInfo(),
            new SmsListenerPackage(),
            new AddCalendarEventPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
