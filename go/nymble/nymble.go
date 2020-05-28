package nymble

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/aries-framework-go/pkg/client/didexchange"
	"github.com/hyperledger/aries-framework-go/pkg/client/route"
	"github.com/hyperledger/aries-framework-go/pkg/didcomm/common/service"
	didcommroute "github.com/hyperledger/aries-framework-go/pkg/didcomm/protocol/route"
	"github.com/hyperledger/aries-framework-go/pkg/didcomm/transport/ws"
	"github.com/hyperledger/aries-framework-go/pkg/framework/aries"
	ariescontext "github.com/hyperledger/aries-framework-go/pkg/framework/context"
	"github.com/hyperledger/aries-framework-go/pkg/storage/mem"
	"github.com/hyperledger/aries-framework-go/pkg/store/verifiable"
	"github.com/pkg/errors"
	"github.com/scoir/allez/pkg/routing_agent"
	basicmessageSvc "github.com/scoir/nymble/pkg/didcomm/protocol/basicmessage"
	messagepickupSvc "github.com/scoir/nymble/pkg/didcomm/protocol/messagepickup"
	"google.golang.org/grpc"

	"pkg/nymble/config"
	"pkg/nymble/log"
)

const (
	DefaultChannel = "default"
)

type EventBus interface {
	SendEvent(channel, message string)
}

// Async - it's a bit hack, we return an empty string because if we don't the generated java will be
// public static native void async(EventBus bus);
// This means we can't use the success callback handler in Java, the callback handler allows us to
// publish back to react via RCTDeviceEventEmitter
//
// noinspection GoUnusedExportedFunction
func Async(bus EventBus) string {
	go func() {
		time.Sleep(time.Second * 5)
		bus.SendEvent(DefaultChannel, "moar poop")
	}()

	return ""
}

type wrapper struct {
	Value interface{} `json:"value"`
}

// noinspection GoUnusedExportedFunction
func TestDebugServer() {
	log.Println("testy badger")

	log.Println("RouterAddress", config.RouterAddress)
	log.Println("RouterPort", config.RouterPort)

	log.Println("DebugIP", config.DebugIP)
	log.Println("DebugPort", config.DebugPort)
}

//HasRouterConnection checks if a router connection has been previously establish
//
//noinspection GoUnusedExportedFunction
func HasRouterConnection() (bool, error) {
	log.Println("dbPath", dbPath)

	ctx, err := getContext()
	if err != nil {
		log.Println(" HasRouterConnection get context", err)
		return false, err
	}

	myRouter, err := route.New(ctx)
	if err != nil {
		log.Println("HasRouterConnection route new", err)
		return false, err
	}

	routerConn, err := myRouter.GetConnection()
	if errors.Is(err, didcommroute.ErrRouterNotRegistered) {
		return false, nil
	}

	if err != nil {
		log.Println("HasRouterConnection", err)
		return false, err
	}

	log.Println("HasRouterConnection", len(routerConn) > 0)

	return len(routerConn) > 0, nil
}

//RegisterWithAgency establishes a connection with the agency
//
//noinspection GoUnusedExportedFunction
func RegisterWithAgency() error {
	cc, err := grpc.Dial(fmt.Sprintf("%s:%s", config.RouterAddress, config.RouterPort), grpc.WithInsecure())
	if err != nil {
		log.Println("RegisterWithAgency grpc dial", err)
		return err
	}
	routingClient := routing_agent.NewRoutingEdgeAgentClient(cc)

	log.Println("connecting to agency")
	resp, err := routingClient.GetEdgeInvitation(context.Background(), &routing_agent.InvitationRequest{})
	if err != nil {
		log.Println("RegisterWithAgency GetEdgeInvitation", err)
		return err
	}

	invite := &didexchange.Invitation{}
	err = json.Unmarshal([]byte(resp.Invitation), invite)
	if err != nil {
		log.Println(invite)
		log.Println("RegisterWithAgency json unmarshal invitation", err)
		return err
	}

	ctx, err := getContext()
	if err != nil {
		log.Println("RegisterWithAgency getContext", err)
		return err
	}

	client, err := didexchange.New(ctx)
	if err != nil {
		log.Println("RegisterWithAgency didexchange new", err)
		return err
	}

	//auto accept
	actionCh := make(chan service.DIDCommAction)
	err = client.RegisterActionEvent(actionCh)
	if err != nil {
		log.Println("RegisterWithAgency RegisterActionEvent", err)
		return err
	}

	go service.AutoExecuteActionEvent(actionCh)

	log.Println("RegisterWithAgency received the invitation")
	log.Println(resp.Invitation)

	connectionID, err := client.HandleInvitation(invite)
	if err != nil {
		return errors.Wrap(err, "unable to handle invitation")
	}

	var connection *didexchange.Connection
	t1 := time.Tick(2 * time.Second)
	for range t1 {
		connection, err = client.GetConnection(connectionID)
		if err != nil {
			log.Println("failed to get connection: %v\n", err)
			return err
		}

		log.Println(fmt.Sprintf("MyDID: %s\nTheirDID: %s\nState: %s, Endpoint: %s\n",
			connection.MyDID, connection.TheirDID, connection.State, connection.ServiceEndPoint))

		if connection.State == "completed" || connection.State == "abandoned" {
			break
		}
	}

	if connection == nil {
		return errors.New("connection abandoned")
	}

	myRouter, err := route.New(ctx)
	if err != nil {
		log.Println("RegisterWithAgency route new", err)
		return err
	}

	err = myRouter.Register(connectionID)
	if err != nil {
		log.Println("RegisterWithAgency router register", connectionID, err)
		return err
	}

	log.Println("RegisterWithAgency done")

	req := &didexchange.QueryConnectionsParams{
		State: "",
	}
	conns, err := client.QueryConnections(req)
	if err != nil {
		log.Println("ListConnections QueryConnections", err)
	}
	for _, conn := range conns {
		log.Println(conn)
	}

	ListConnections()

	return nil
}

// HandleInvite processes the data provided by a scanned QR code in the mobile applications
//
//noinspection GoUnusedExportedFunction
func HandleInvite(invite string) (string, error) {
	ctx, err := getContext()
	if err != nil {
		log.Println("HandleInvite getContext", err)
		return "", err
	}

	client, err := createClient(ctx)
	if err != nil {
		log.Println("HandleInvite createClient", err)
		return "", err
	}

	log.Println("HandleInvite", invite)

	hs := &didexchange.Invitation{}
	err = json.Unmarshal([]byte(invite), hs)
	if err != nil {
		log.Println("HandleInvite json marshal", err)
		return "", err
	}

	connID, err := client.HandleInvitation(hs)
	if err != nil {
		log.Println("HandleInvite fo real", err)
		return "", err
	}

	log.Println("HandleInvite connection ID", connID)

	//max timeout
	t := time.Tick(2 * time.Second)
	for range t {
		conn, _ := client.GetConnection(connID)
		log.Println(conn.TheirLabel, conn.State)
		if conn.State == "completed" || conn.State == "abandoned" {
			break
		}
	}

	return connID, nil
}

// ListConnections currently only returns "completed" connections
//
//noinspection GoUnusedExportedFunction
func ListConnections() (string, error) {
	log.Println("dbPath again", dbPath)

	ctx, err := getContext()
	if err != nil {
		return "", err
	}

	client, err := createClient(ctx)
	if err != nil {
		log.Println("ListConnections createContext", err)
		return "", err
	}

	req := &didexchange.QueryConnectionsParams{
		State: "",
	}
	conns, err := client.QueryConnections(req)
	if err != nil {
		log.Println("ListConnections QueryConnections", err)
		return "", err
	}
	for _, conn := range conns {
		log.Println(conn)
	}

	s, err := json.Marshal(conns)
	if err != nil {
		log.Println("ListConnections json marshal", err)
		return "", err
	}

	log.Println("ListConnections", string(s))

	return string(s), nil
}

//GetConnection fetches single connection record for given id
//
//noinspection GoUnusedExportedFunction
func GetConnection(connectionID string) (string, error) {
	ctx, err := getContext()
	if err != nil {
		log.Println("GetConnection getContext", err)
		return "", err
	}

	client, err := createClient(ctx)
	if err != nil {
		log.Println("GetConnection createClient", err)
		return "", err
	}

	conn, err := client.GetConnection(connectionID)

	b, err := json.Marshal(conn)
	if err != nil {
		log.Println("GetConnection json marshal", err)
		return "", err
	}

	log.Println("GetConnection", conn)

	return string(b), nil
}

// List Credentials all credentials in wallet
//
//noinspection GoUnusedExportedFunction
func ListCredentials() (string, error) {
	ctx, err := getContext()
	if err != nil {
		log.Println("ListCredentials getContext", err)
		return "", err
	}

	vc, err := verifiable.New(ctx)
	if err != nil {
		log.Println("ListCredentials verifiable new", err)
		return "", err
	}

	creds := vc.GetCredentials()
	for _, cr := range creds {
		log.Println(cr.ID, ":", cr.Name)
		cred, err := vc.GetCredential(cr.ID)
		if err != nil {
			log.Println("ListCredentials GetCredential", cr.ID, err)
			continue
		}

		log.Println("\t", cred.Issued)
		log.Println("\t", cred.Issuer.Name)
	}

	b, err := json.Marshal(creds)
	if err != nil {
		log.Println("failed to marshal credentials", err)
		return "", err
	}

	return string(b), nil
}

// GetCredential returns a single credential by id
//
//noinspection GoUnusedExportedFunction
func GetCredential(credentialID string) (string, error) {
	ctx, err := getContext()
	if err != nil {
		log.Println("GetCredential getContext", err)
		return "", err
	}

	vc, err := verifiable.New(ctx)
	if err != nil {
		log.Println("GetCredential verifiable new", err)
		return "", err
	}

	credential, err := vc.GetCredential(credentialID)
	if err != nil {
		log.Println("GetCredential fo real", credentialID, err)
		return "", err
	}

	s, err := json.Marshal(credential)
	if err != nil {
		log.Println("GetCredential json marshal", credentialID, err)
		return "", err
	}

	log.Println("GetCredential", credential)

	return string(s), nil
}

func createClient(ctx *ariescontext.Provider) (*didexchange.Client, error) {

	client, err := didexchange.New(ctx)
	if err != nil {
		log.Println("createClient", err)
		return nil, err
	}

	return client, nil
}

func getContext() (*ariescontext.Provider, error) {
	framework, err := aries.New(
		aries.WithTransportReturnRoute("all"),
		aries.WithOutboundTransports(ws.NewOutbound()),
		aries.WithStoreProvider(mem.NewProvider()),
		aries.WithProtocols(messagepickupSvc.ServiceCreator(nil), basicmessageSvc.ServiceCreator()),
	)

	if err != nil {
		return nil, err
	}
	ctx, err := framework.Context()
	if err != nil {
		return nil, err
	}

	return ctx, nil
}

var dbPath string
// SetDBPath global for storing the couchdb path on device
//
//noinspection GoUnusedExportedFunction
func SetDBPath(s string) {
	dbPath = s
}