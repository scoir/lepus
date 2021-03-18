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
import com.lepus.bridge.model.MediatorStatus;
import com.lepus.bridge.model.QueryConnectionResults;
import com.lepus.bridge.model.QueryCredentialResults;
import com.lepus.bridge.model.RegisterRoute;

import org.hyperledger.aries.api.AriesController;
import org.hyperledger.aries.api.DIDExchangeController;
import org.hyperledger.aries.api.MediatorController;
import org.hyperledger.aries.api.VerifiableController;
import org.hyperledger.aries.ariesagent.Ariesagent;
import org.hyperledger.aries.config.Options;
import org.hyperledger.aries.models.CommandError;
import org.hyperledger.aries.models.RequestEnvelope;
import org.hyperledger.aries.models.ResponseEnvelope;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class CanisModule extends ReactContextBaseJavaModule implements DIDExchangeHandler.DIDExchangeCallback, IssueCredentialHandler.IssueCredentialCallback {
    private static ReactApplicationContext reactContext;
    private String tag = "Canis";

    AriesController agent;
    DIDExchangeController didExchangeController;
    DIDExchangeHandler didExchangeHandler;
    Map<String, Callback> connectionCallbackes;

    MediatorController mediatorController;

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
        opts.setUseLocalAgent(true);
        opts.setTransportReturnRoute("all");
        opts.setLogLevel("DEBUG");
        opts.addHTTPResolver("sov@http://10.0.2.2:5544/did");
        opts.addOutboundTransport("ws");

        try {
            agent = Ariesagent.new_(opts);
            didExchangeController = agent.getDIDExchangeController();
            didExchangeHandler = new DIDExchangeHandler(agent.getDIDExchangeController(), this);
            agent.registerHandler(didExchangeHandler, "didexchange_states");

            mediatorController = agent.getMediatorController();

            verifiableController = agent.getVerifiableController();
            issueCredHandler = new IssueCredentialHandler(agent.getIssueCredentialController(), this);
            agent.registerHandler(issueCredHandler, "issue-credential_actions");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void mediatorConnection(Callback success, Callback error) {

        try {
            byte[] data = "{}".getBytes(StandardCharsets.UTF_8);
            ResponseEnvelope resp = mediatorController.connections(new RequestEnvelope(data));

            if (resp.getError() != null) {
                CommandError err = resp.getError();
                error.invoke(err.toString());
            } else {
                GsonBuilder gsonb = new GsonBuilder();
                Gson gson = gsonb.create();

                String actionsResponse = new String(resp.getPayload(), StandardCharsets.UTF_8);
                RegisterRoute out = gson.fromJson(actionsResponse, RegisterRoute.class);

                success.invoke(out.connectionID);
            }

        } catch (Exception e) {
            error.invoke(e.getMessage());
        }
    }



    @ReactMethod
    public void mediatorStatus(Callback success, Callback error) {

        try {
            byte[] data = "{}".getBytes(StandardCharsets.UTF_8);
            ResponseEnvelope resp = mediatorController.status(new RequestEnvelope(data));

            if (resp.getError() != null) {
                CommandError err = resp.getError();
                error.invoke(err.toString());
            } else {
                GsonBuilder gsonb = new GsonBuilder();
                Gson gson = gsonb.create();

                String actionsResponse = new String(resp.getPayload(), StandardCharsets.UTF_8);
                MediatorStatus out = gson.fromJson(actionsResponse, MediatorStatus.class);

                gsonb = new GsonBuilder();
                gson = gsonb.create();

                String result = gson.toJson(out);
                success.invoke(result);
            }

        } catch (Exception e) {
            error.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void registerRoute(String connectionID, Callback success, Callback error) {
        try {
            RegisterRoute req = new RegisterRoute();
            req.connectionID = connectionID;

            GsonBuilder gsonb = new GsonBuilder();
            Gson gson = gsonb.create();

            String reqJSON = gson.toJson(req);
            byte[] data = reqJSON.getBytes(StandardCharsets.UTF_8);
            System.out.println(new String(data));
            ResponseEnvelope resp = mediatorController.register(new RequestEnvelope(data));

            if (resp.getError() != null) {
                CommandError err = resp.getError();
                error.invoke(err.toString());
            } else {
                success.invoke("Ok");
            }

        } catch (Exception e) {
            error.invoke(e.getMessage());
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
                QueryConnectionResults results = gson.fromJson(actionsResponse, QueryConnectionResults.class);
                if (results.results != null) {
                    out.addAll(results.results);
                }

                gsonb = new GsonBuilder();
                gson = gsonb.create();

                String result = gson.toJson(out);
                success.invoke(result);
            }


        } catch (Exception e) {
            error.invoke(e.getMessage());
        }

    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void handleInvitation(String invitation, Callback success, Callback error) {
        ResponseEnvelope res;
        try {
            System.out.println(invitation);

            byte[] data = invitation.getBytes(StandardCharsets.UTF_8);
            byte[] decoded = Base64.getDecoder().decode(data);

            System.out.println(new String(decoded));

            RequestEnvelope env = new RequestEnvelope(decoded);
            env.setPayload(decoded);

            res = didExchangeController.receiveInvitation(env);
            if (res.getError() != null) {
                CommandError err = res.getError();
                error.invoke(err.toString());
            } else {
                String actionsResponse = new String(res.getPayload(), StandardCharsets.UTF_8);
                GsonBuilder gsonb = new GsonBuilder();
                Gson gson = gsonb.create();
                ConnectionResult results = gson.fromJson(actionsResponse, ConnectionResult.class);
                if (results.code == 2003) {
                    error.invoke("Already connectioned");
                } else {
                    System.out.println("Saving conneciton: " + results.ConnectionID);
                    System.out.println(actionsResponse);
                    connectionCallbackes.put(results.ConnectionID, success);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            error.invoke(e.getMessage());
        }

    }

    @ReactMethod
    public void acceptInvitation(String connectionID, String label, Callback success, Callback error) {
        connectionCallbackes.put(connectionID, success);
        didExchangeHandler.Continue(connectionID, label);
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
                error.invoke(error.toString());
                return;
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
        System.out.println("checking success: " + connectionID);
        Callback success = connectionCallbackes.get(connectionID);
        if (success != null) {
            System.out.println("calling success");
            success.invoke(connectionID, label);
            connectionCallbackes.remove(connectionID);
        }
    }

    @Override
    public void onCompleted(String connectionID, String label) {
        Callback success = connectionCallbackes.get(connectionID);
        if (success != null) {
            success.invoke(connectionID, label);
            connectionCallbackes.remove(connectionID);
        }
    }

    @Override
    public void onOffer(String piid, String label) {
        if(credentialOfferHandler != null) {
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
