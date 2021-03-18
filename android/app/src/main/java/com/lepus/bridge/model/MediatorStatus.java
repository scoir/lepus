package com.lepus.bridge.model;

import com.google.gson.annotations.SerializedName;

import java.util.Date;

public class MediatorStatus {
    @SerializedName("@type") public String Type;
    @SerializedName("@id") public String ID;
    @SerializedName("message_count") public Integer MessageCount;
    @SerializedName("duration_waited") public Integer DurationWaited;
    @SerializedName("last_added_time") public Date LastAddedTime;
    @SerializedName("last_delivered_time") public Date LastDeliveredTime;
    @SerializedName("last_removed_time") public Date LastRemovedTime;
    @SerializedName("total_size") public Integer TotalSize;
}
