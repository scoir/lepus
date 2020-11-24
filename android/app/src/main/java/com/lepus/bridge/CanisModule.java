package com.lepus.bridge;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.lepus.bridge.model.Connection;
import com.lepus.bridge.model.ConnectionResult;
import com.lepus.bridge.model.Credential;
import com.lepus.bridge.model.QueryConnectionResults;
import com.lepus.bridge.model.QueryCredentialResults;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.hyperledger.aries.api.AriesController;
import org.hyperledger.aries.api.DIDExchangeController;
import org.hyperledger.aries.api.VerifiableController;
import org.hyperledger.aries.ariesagent.Ariesagent;
import org.hyperledger.aries.config.Options;
import org.hyperledger.aries.models.CommandError;
import org.hyperledger.aries.models.RequestEnvelope;
import org.hyperledger.aries.models.ResponseEnvelope;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CanisModule extends ReactContextBaseJavaModule implements DIDExchangeHandler.DIDExchangeCallback, IssueCredentialHandler.IssueCredentialCallback {
    private static ReactApplicationContext reactContext;
    private String tag = "Canis";

    AriesController agent;
    DIDExchangeController didExchangeController;
    DIDExchangeHandler didExchangeHandler;
    Map<String, Callback> connectionCallbackes;

    VerifiableController verifiableController;
    IssueCredentialHandler issueCredHandler;
    Callback credentialOfferHandler;
    Map<String, Callback> credentialCallbackes;


    public CanisModule(@NonNull ReactApplicationContext context) {
        super(context);
        reactContext = context;

        connectionCallbackes = new HashMap<>();
        credentialCallbackes = new HashMap<>();

        Options opts = new Options();
        opts.setUseLocalAgent(false);
        opts.setLogLevel("INFO");
        opts.setAgentURL("http://10.0.2.2:5533");
        opts.setWebsocketURL("ws://10.0.2.2:5533/ws");

        try {
            agent = Ariesagent.new_(opts);
            didExchangeController = agent.getDIDExchangeController();
            didExchangeHandler = new DIDExchangeHandler(agent.getDIDExchangeController(), this);
            agent.registerHandler(didExchangeHandler, "didexchange_states");

            verifiableController = agent.getVerifiableController();
            issueCredHandler = new IssueCredentialHandler(agent.getIssueCredentialController(), this);
            agent.registerHandler(issueCredHandler, "issue-credential_actions");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void listConnections(Callback success, Callback error) {

        ArrayList<Connection> out = new ArrayList<>();
        try {
            byte[] data = "{}".getBytes(StandardCharsets.UTF_8);
            ResponseEnvelope resp = didExchangeController.queryConnections(new RequestEnvelope(data));

            if (resp.getError() != null) {
                CommandError err = resp.getError();
                error.invoke(err.toString());
            } else {
                GsonBuilder gsonb = new GsonBuilder();
                Gson gson = gsonb.create();

                String actionsResponse = new String(resp.getPayload(), StandardCharsets.UTF_8);
                System.out.println(actionsResponse);
                QueryConnectionResults results = gson.fromJson(actionsResponse, QueryConnectionResults.class);
                if (results.results != null) {
                    out.addAll(results.results);
                }
            }


        } catch (Exception e) {
            error.invoke(e.getMessage());
            return;
        }

        GsonBuilder gsonb = new GsonBuilder();
        Gson gson = gsonb.create();

        String result = gson.toJson(out);
        success.invoke(result);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void handleInvitation(String invitation, Callback success, Callback error) {
        ResponseEnvelope res;
        try {
            byte[] data = invitation.getBytes(StandardCharsets.UTF_8);
            byte[] decoded = Base64.getDecoder().decode(data);

            String poop = new String(decoded);


            List<NameValuePair> params = URLEncodedUtils.parse(new URI(poop), StandardCharsets.UTF_8);

            NameValuePair value = null;
            for (NameValuePair param : params) {
                if (param.getName().equals("c_i") || param.getName().equals("_oob")) {
                    value = param;
                    break;
                }
            }

            if (value == null) {
                error.invoke("no matching param found for invite");
                return;
            }

            byte[] inv = value.getValue().getBytes();

            res = didExchangeController.receiveInvitation(new RequestEnvelope(inv));
            if (res.getError() != null) {
                CommandError err = res.getError();
                error.invoke(error.toString());
            } else {
                String actionsResponse = new String(res.getPayload(), StandardCharsets.UTF_8);
                GsonBuilder gsonb = new GsonBuilder();
                Gson gson = gsonb.create();
                ConnectionResult results = gson.fromJson(actionsResponse, ConnectionResult.class);
                if (results.code == 2003) {
                    error.invoke("Already connectioned");
                } else {
                    connectionCallbackes.put(results.ConnectionID, success);
                }
            }
        } catch (Exception e) {
            error.invoke(e.getMessage());
        }

    }

    public boolean containsName(final List<NameValuePair> list, final String name) {
        return list.stream().anyMatch(o -> o.getName().equals(name));
    }

    @ReactMethod
    public void listCredentials(Callback success, Callback error) {

        ArrayList<Credential> out = new ArrayList<>();
        try {

            byte[] data = "{}".getBytes(StandardCharsets.UTF_8);
            ResponseEnvelope resp = verifiableController.getCredentials(new RequestEnvelope(data));

            if (resp.getError() != null) {
                CommandError err = resp.getError();
                System.out.println(err.toString());
            } else {
                GsonBuilder gsonb = new GsonBuilder();
                Gson gson = gsonb.create();

                String actionsResponse = new String(resp.getPayload(), StandardCharsets.UTF_8);
                System.out.println(actionsResponse);
                QueryCredentialResults results = gson.fromJson(actionsResponse, QueryCredentialResults.class);
                if (results.results != null) {
                    out.addAll(results.results);
                }
            }


        } catch (Exception e) {
            error.invoke(e.getMessage());
            return;
        }

        GsonBuilder gsonb = new GsonBuilder();
        Gson gson = gsonb.create();

        String result = gson.toJson(out);
        success.invoke(result);
    }

    @ReactMethod
    public void handleCredentialOffers(Callback handler) {
        this.credentialOfferHandler = handler;
    }

    @ReactMethod
    public void acceptCredential(String piid, String label, Callback success) {
        issueCredHandler.acceptOffer(piid, label);
        this.credentialCallbackes.put(piid, success);
    }


    @ReactMethod
    public void acceptInvitation(String connectionID, String label, Callback success, Callback error) {
        didExchangeHandler.Continue(connectionID, label);
        success.invoke("ok");
    }

    @ReactMethod
    public void getConnection(String connectionID, Callback success, Callback error) {
        success.invoke(connectionID);
    }

    @ReactMethod
    public void hasRouterConnection(Callback success, Callback error) {
        success.invoke(true);
    }

    @ReactMethod
    public void registerWithAgency(Callback success, Callback error) {
        success.invoke("ok");
    }

    @NonNull
    @Override
    public String getName() {
        return this.tag;
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }


    @Override
    public void onInvited(String connectionID, String label) {
        Callback success = connectionCallbackes.get(connectionID);
        if (success != null) {
            success.invoke(connectionID, label);
            connectionCallbackes.remove(connectionID);
        }
    }

    @Override
    public void onOffer(String piid, String label) {
        if (credentialOfferHandler != null) {
            credentialOfferHandler.invoke(piid, label);
        }
    }

    @Override
    public void accepted(String piid) {
        Callback success = credentialCallbackes.get(piid);
        if (success != null) {
            success.invoke(piid);
            connectionCallbackes.remove(piid);
        }
    }


}
