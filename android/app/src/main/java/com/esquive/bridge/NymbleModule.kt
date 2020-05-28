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

    private val tag = "Nymble"
    private val filesDir = reactContext?.filesDir

    @ReactMethod
    fun registerWithAgency(success: Callback, error: Callback) {
        try {
            Nymble.registerWithAgency()
        } catch (e: Exception) {
            error.invoke("failed to register with agency")
            Log.e(tag, e.toString())
            return
        }
        success.invoke("ok")
    }

    @ReactMethod
    fun hasRouterConnection(success: Callback, error: Callback) {
        val result: Boolean
        result = try {
            Nymble.hasRouterConnection()
        } catch (e: Exception) {
            error.invoke("failed to run router check")
            Log.e(tag, e.toString())
            return
        }
        Log.i(tag, "hasRouteConnection $result")
        success.invoke(result)
    }

    @ReactMethod
    fun handleInvitation(invitation: String, success: Callback, error: Callback) {
        val result: String
        result = try {
            Nymble.handleInvite(invitation)
        } catch (e: Exception) {
            error.invoke("failed to handle invitation")
            Log.e(tag, e.toString())
            return
        }
        Log.i(tag, "handleInvitation $result")
        success.invoke(result)
    }

    @ReactMethod
    fun listConnections(success: Callback, error: Callback) {
        Log.i(tag, "list connections")
        val result: String
        result = try {
            Nymble.listConnections()
        } catch (e: Exception) {
            error.invoke("failed to list connections")
            Log.e(tag, e.toString())
            return
        }
        Log.i(tag, "listConnections $result")
        success.invoke(result)
    }

    @ReactMethod
    fun getConnection(connectionID: String, success: Callback, error: Callback) {
        Log.i(tag, "get connection")
        val result: String
        result = try {
            Nymble.getConnection(connectionID)
        } catch (e: Exception) {
            error.invoke("failed to get connection")
            Log.e(tag, e.toString())
            return
        }
        Log.i(tag, "getConnection $result")
        success.invoke(result)
    }

    @ReactMethod
    fun testDebug(success: Callback, error: Callback) {
        Log.i(tag, "debugging debug")
        Nymble.testDebugServer()

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

    @ReactMethod
    fun setDBPath(success: Callback, error: Callback) {
        Nymble.setDBPath(this.filesDir?.absolutePath)

        success.invoke("success")
    }

    override fun getName(): String {
        return "Nymble"
    }
}
