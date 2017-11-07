package com.ebolo.cafeapp;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

// Required package
import io.invertase.firebase.RNFirebasePackage; // <-- Add this line
// Optional packages - add as appropriate
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // Firebase Auth
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // Firebase Cloud Messaging

import com.reactnativenavigation.NavigationApplication;

public class MainApplication extends NavigationApplication {

	private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

	protected static CallbackManager getCallbackManager() {
		return mCallbackManager;
	}

	@Override
	public void onCreate() {
		super.onCreate();
		SoLoader.init(this, /* native exopackage */ false);
		FacebookSdk.sdkInitialize(getApplicationContext());
		// If you want to use AppEventsLogger to log events.
		AppEventsLogger.activateApp(this);
	}
	
	@Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }
	
	protected List<ReactPackage> getPackages() {
		  return Arrays.<ReactPackage>asList(
			  new MainReactPackage(),
			  new RNFirebasePackage(),  // <-- Add this line
			  // Add these packages as appropriate
			  new RNFirebaseAuthPackage(),
			  new RNFirebaseMessagingPackage(),
			  new FBSDKPackage(mCallbackManager),
			  new RNGoogleSigninPackage() // <-- add this for react-native-google-signin
		  );
		}
	
	@Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
	
	@Override
	protected void attachBaseContext(Context base) {
		super.attachBaseContext(base);
		MultiDex.install(this);
	}
}
