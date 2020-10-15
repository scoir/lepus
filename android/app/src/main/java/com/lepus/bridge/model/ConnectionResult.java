package com.lepus.bridge.model;

import com.google.gson.annotations.SerializedName;

public class ConnectionResult {
    @SerializedName("code") public int code;
    @SerializedName("message") public String message;
    @SerializedName("connection_id")public String ConnectionID;
}


