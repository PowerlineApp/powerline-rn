package ne.powerli;

import android.app.Application;

import com.facebook.react.ReactInstanceManager;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.github.alinz.rnsk.RNSKPackage;

import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.vonovak.AddCalendarEventPackage;
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

import io.fabric.sdk.android.Fabric;
import java.util.Arrays;
import java.util.List;

// import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.BV.LinearGradient.LinearGradientPackage;

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
            new RNFSPackage(),
            new RNSKPackage(),

        new RNMixpanel(),
        new AddCalendarEventPackage(),
        new StripeReactPackage(),
        new VectorIconsPackage(),
        new PickerPackage(),
        new RNSharePackage(),
        new RNFetchBlobPackage(),
        new RNDeviceInfo(),
        new ReactNativeOneSignalPackage(),
        new SharePackage(),
        new ReactNativeYouTube(),
        new FBSDKPackage(),
        // new SplashScreenReactPackage(),
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
