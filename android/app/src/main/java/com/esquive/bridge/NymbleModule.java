package com.esquive.bridge;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import nymble.Foo;
import nymble.Nymble;


/*
The following types can be sent to JS (through JS module or callback):

primitives
String
WritableArray
WritableMap
 */
public class NymbleModule extends ReactContextBaseJavaModule {

    @ReactMethod
    public void structy(Callback success, Callback error) {
        String result;
        try {
            result = Nymble.returnStruct();
        } catch (Exception e) {
            error.invoke("It's all gone Pete Tong");
            e.printStackTrace();
            return;
        }

        success.invoke(result);
    }

    @ReactMethod
    public void stringy(Callback success) {
        success.invoke(Nymble.poop());
    }

    @ReactMethod
    public void asyncHello(Callback success) {
        final ReactApplicationContext context = this.getReactApplicationContext();

        //noinspection Convert2Lambda
        success.invoke(Nymble.async(new nymble.EventBus() {
            @Override
            public void sendEvent(String channel, String message) {
                Log.i(channel, message);
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(channel, message);
            }
        }));
    }

    @NonNull
    @Override
    public String getName() {
        return "Nymble";
    }

    NymbleModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
}
