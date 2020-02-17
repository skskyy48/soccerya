package com.soccerya;

import android.os.Bundle;
import android.content.Intent;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.google.android.gms.ads.MobileAds;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            SplashScreen.show(this,true);
            super.onCreate(savedInstanceState);
            MobileAds.initialize(this, "ca-app-pub-7735668451615080~8602862645");
        }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "soccerya";
    }

    @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
          return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
     protected ReactRootView createRootView() {
                       return new RNGestureHandlerEnabledRootView(MainActivity.this);
                     }
    };
          }
}
