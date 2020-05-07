package com.esquive.bridge

import android.util.Log
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import nymble.Nymble

/*
The following types can be sent to JS (through JS module or callback):

primitives
String
WritableArray
WritableMap
 */
class NymbleModule internal constructor(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext!!) {

    @ReactMethod
    fun handleInvitation(invitation: String, success: Callback, error: Callback) {
        val result: String
        result = try {
            Nymble.handleInvite(invitation)
        } catch (e: Exception) {
            error.invoke("It's all gone Pete Tong")
            Log.e("nymble", e.toString())
            return
        }

        success.invoke(result)
    }

    @ReactMethod
    fun testDebug(success: Callback, error: Callback) {
        try {
            Nymble.testDebugServer()
        } catch (e: Exception) {
            error.invoke("failed invocation")
            Log.e("testDebug", e.toString())
            return
        }

        success.invoke("success")
    }

    @ReactMethod
    fun asyncHello(success: Callback) {
        val context = this.reactApplicationContext
        success.invoke(Nymble.async { channel, message ->
            Log.i(channel, message)
            context.getJSModule(RCTDeviceEventEmitter::class.java)
                    .emit(channel, message)
        })
    }

    override fun getName(): String {
        return "Nymble"
    }
}