package nymble

import (
	"context"
	"encoding/json"
	"time"

	"github.com/hyperledger/aries-framework-go/pkg/client/didexchange"
	"github.com/hyperledger/aries-framework-go/pkg/client/route"
	"github.com/hyperledger/aries-framework-go/pkg/didcomm/common/service"
	"github.com/hyperledger/aries-framework-go/pkg/didcomm/transport/ws"
	didcommroute "github.com/hyperledger/aries-framework-go/pkg/didcomm/protocol/route"
	"github.com/hyperledger/aries-framework-go/pkg/framework/aries"
	ariescontext "github.com/hyperledger/aries-framework-go/pkg/framework/context"
	"github.com/hyperledger/aries-framework-go/pkg/storage/mem"
	"github.com/pkg/errors"
	"github.com/scoir/allez/pkg/routing_agent"
	basicmessageSvc "github.com/scoir/nymble/pkg/didcomm/protocol/basicmessage"
	messagepickupSvc "github.com/scoir/nymble/pkg/didcomm/protocol/messagepickup"
	"google.golang.org/grpc"

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
}

//HasRouteConnection checks if a router connection has been previously establish
//
//noinspection GoUnusedExportedFunction
func HasRouteConnection() (bool, error) {
	log.Println("HasRouteConnection")
	ctx, err := getContext()
	if err != nil {
		log.Println("get context", err)
		return false, err
	}

	myRouter, err := route.New(ctx)
	if err != nil {
		return false, errors.Wrap(err, "failed to create route client for router")
	}

	routerConn, err := myRouter.GetConnection()
	if errors.Is(err, didcommroute.ErrRouterNotRegistered) {
		return false, nil
	}

	if err != nil {
		log.Println(err)
		return false, errors.Wrap(err, "failed to register with the my router")
	}

	return len(routerConn) > 0, nil
}

//RegisterWithAgency establishes a connection with the agency
//
//noinspection GoUnusedExportedFunction
func RegisterWithAgency() error {
	cc, err := grpc.Dial("minikube.scoir.com:31068", grpc.WithInsecure())
	if err != nil {
		log.Println("failed to dial grpc", err)
		return err
	}
	routerCli := routing_agent.NewRoutingEdgeAgentClient(cc)

	log.Println("connecting to agency")
	resp, err := routerCli.GetEdgeInvitation(context.Background(), &routing_agent.InvitationRequest{})
	if err != nil {
		return errors.Wrap(err, "failed to retrieve invitation from router")
	}

	invite := &didexchange.Invitation{}
	err = json.Unmarshal([]byte(resp.Invitation), invite)
	if err != nil {
		return errors.Wrap(err, "failed to unmarshal invitation from router")
	}

	ctx, err := getContext()
	if err != nil {
		return err
	}

	client, err := didexchange.New(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to create client for router")
	}

	actionCh := make(chan service.DIDCommAction)
	err = client.RegisterActionEvent(actionCh)
	if err != nil {
		return errors.Wrap(err, "unable to register with didexchange")
	}

	go service.AutoExecuteActionEvent(actionCh)

	log.Println("received the invitation")
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

		log.Println("MyDID: %s\nTheirDID: %s\nState: %s, Endpoint: %s\n", connection.MyDID, connection.TheirDID, connection.State, connection.ServiceEndPoint)

		if connection.State == "completed" {
			break
		}
	}

	myRouter, err := route.New(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to create route client for router: %v\n")
	}

	err = myRouter.Register(connectionID)
	if err != nil {
		return errors.Wrap(err, "failed to register with the my router: %v\n")
	}

	return nil
}

// HandleInvite processes the data provided by a scanned QR code in the mobile applications
//
//noinspection GoUnusedExportedFunction
func HandleInvite(invite string) (string, error) {
	ctx, err := getContext()
	if err != nil {
		log.Println(err)
		return "", err
	}

	client, err := createClient(ctx)
	if err != nil {
		return "", err
	}

	//handling invite
	log.Println(invite)

	hs := &didexchange.Invitation{}
	err = json.Unmarshal([]byte(invite), hs)
	if err != nil {
		log.Println("parse invitation failed", invite)
		return "", errors.New("bad json")
	}

	connID, err := client.HandleInvitation(hs)
	if err != nil {
		log.Println("failed to handle invitation")
		return "", errors.New("failed to handle invitation")
	}

	log.Println("HandleInvite connection ID", connID)

	t := time.Tick(2 * time.Second)
	for range t {
		conn, _ := client.GetConnection(connID)
		log.Println(conn.TheirLabel, conn.State)
		if conn.State == "completed" || conn.State == "abandoned" {
			break
		}
	}

	ListConnections()

	GetConnection(connID)

	return connID, nil
}

// ListConnections currently only returns "completed" connections
//
//noinspection GoUnusedExportedFunction
func ListConnections() (string, error) {
	ctx, err := getContext()
	if err != nil {
		return "", err
	}

	client, err := createClient(ctx)
	if err != nil {
		return "", errors.New("failed to list connections")
	}

	req := &didexchange.QueryConnectionsParams{
		State: "",
	}
	conns, err := client.QueryConnections(req)
	if err != nil {
		log.Println("QueryConnections failed", err)
		return "", err
	}
	for _, conn := range conns {
		log.Println(conn)
	}

	s, err := json.Marshal(conns)
	if err != nil {
		return "", err
	}

	log.Println("ListConnections", string(s))

	return string(s), nil

	//fmt.Println("Credentials in Wallet")
	//creds := r.store.GetCredentials()
	//for _, cr := range creds {
	//	fmt.Println(cr.ID, ":", cr.Name)
	//	cred, err := r.store.GetCredential(cr.ID)
	//	if err != nil {
	//		log.Println("error getting cred", cr.ID)
	//	}
	//
	//	log.Println("\t", cred.Issued)
	//	log.Println("\t", cred.Issuer.Name)
	//}    fmt.Println("Credentials in Wallet")
	//creds := r.store.GetCredentials()
	//for _, cr := range creds {
	//	fmt.Println(cr.ID, ":", cr.Name)
	//	cred, err := r.store.GetCredential(cr.ID)
	//	if err != nil {
	//		log.Println("error getting cred", cr.ID)
	//	}
	//
	//	log.Println("\t", cred.Issued)
	//	log.Println("\t", cred.Issuer.Name)
	//}
}

//GetConnection fetches single connection record for given id
//
//noinspection GoUnusedExportedFunction
func GetConnection(connectionID string) (string, error) {
	ctx, err := getContext()
	if err != nil {
		return "", err
	}

	client, err := createClient(ctx)
	if err != nil {
		return "", errors.New("failed to get connection")
	}

	conn, err := client.GetConnection(connectionID)

	s, err := json.Marshal(conn)
	if err != nil {
		return "", err
	}

	log.Println("GetConnection", conn)

	return string(s), nil
}

func createClient(ctx *ariescontext.Provider) (*didexchange.Client, error) {

	client, err := didexchange.New(ctx)
	if err != nil {
		log.Println("failed to create didexchange", err)
		return nil, errors.Wrap(err, "failed to create client")
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
