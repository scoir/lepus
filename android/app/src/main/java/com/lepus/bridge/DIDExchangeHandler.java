package com.lepus.bridge;

import android.annotation.SuppressLint;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Callback;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.lepus.bridge.model.InviteStateMsg;
import com.lepus.bridge.model.StateProtocolMsg;
import org.hyperledger.aries.api.DIDExchangeController;
import org.hyperledger.aries.api.Handler;
import org.hyperledger.aries.models.RequestEnvelope;
import org.hyperledger.aries.models.ResponseEnvelope;

import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.Formatter;
import java.util.Locale;

public class DIDExchangeHandler implements Handler {

    String lastTopic, lastMessage;
    DIDExchangeController ctrl;
    DIDExchangeCallback cb;

    public interface DIDExchangeCallback {
        void onInvited(String connectionID, String label);
        void onCompleted(String connectionID, String label);
    }

    public DIDExchangeHandler(DIDExchangeController c, DIDExchangeCallback cb) {
        this.ctrl = c;
        this.cb = cb;
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @SuppressLint("LongLogTag")
    @Override
    public void handle(String topic, byte[] message) {
        lastTopic = topic;
        lastMessage = new String(message, StandardCharsets.UTF_8);

        GsonBuilder gsonb = new GsonBuilder();
        Gson gson = gsonb.create();

        Type msgType = new TypeToken<StateProtocolMsg<InviteStateMsg>>(){}.getType();
        StateProtocolMsg<InviteStateMsg> msg = gson.fromJson(lastMessage, msgType);

        Log.d("received notification type: ", msg.message.Type);
        Log.d("received notification topic: ", lastTopic);
        Log.d("received notification message: ", lastMessage);
        Log.d("received notification message STATE: ", msg.message.StateID);

        if (msg.message.StateID.equals("invited") && msg.message.Type.equals("post_state")) {
            cb.onInvited(msg.message.getConnectionID(), msg.message.message.label);
        } else if (msg.message.StateID.equals("completed") && msg.message.Type.equals("post_state")) {
            cb.onCompleted(msg.message.getConnectionID(), msg.message.message.label);
        }
    }

    public void Continue(String connectionID, String name) {
        try {
            StringBuilder sb = new StringBuilder();
            Formatter formatter = new Formatter(sb, Locale.US);
            String accept = formatter.format("{\"id\": \"%s\"}", connectionID).toString();
            Log.d("accept", accept);
            byte[] data = accept.getBytes(StandardCharsets.US_ASCII);

            System.out.println(new String(data));

            RequestEnvelope env = new RequestEnvelope(null);
            env.setPayload(data);
            ResponseEnvelope res = ctrl.acceptInvitation(env);
            if(res.getError() != null && !res.getError().getMessage().isEmpty()) {
                Log.d("ACCEPT_INVITATION_ERROR", res.getError().toString());
            } else {
                String receiveInvitationResponse = new String(res.getPayload(), StandardCharsets.UTF_8);
                Log.d("ACCEPT_INVITATION: ", receiveInvitationResponse);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
