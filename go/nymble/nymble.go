package nymble

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/hyperledger/aries-framework-go/pkg/client/didexchange"
	"github.com/hyperledger/aries-framework-go/pkg/didcomm/common/service"
	"github.com/hyperledger/aries-framework-go/pkg/didcomm/transport/ws"
	"github.com/hyperledger/aries-framework-go/pkg/framework/aries"
	"github.com/hyperledger/aries-framework-go/pkg/storage/mem"
	"github.com/pkg/errors"
	basicmessageSvc "github.com/scoir/nymble/pkg/didcomm/protocol/basicmessage"
	messagepickupSvc "github.com/scoir/nymble/pkg/didcomm/protocol/messagepickup"

	"pkg/nymble/log"
)

const (
	DefaultChannel = "default"
)

var HostIP string

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
func TestDebugServer() error {

	_, err := http.Get(fmt.Sprintf("http://172.16.1.1:8910/log/%s",
		base64.StdEncoding.EncodeToString([]byte(fmt.Sprintln("testy badger")))))

	if err != nil {
		return errors.WithMessage(err, "TestDebugServer request failed")
	}

	return nil
}

// HandleInvite processes the data provided by a scanned QR code in the mobile applications
//noinspection GoUnusedExportedFunction
func HandleInvite(invite string) (string, error) {

	framework, err := aries.New(
		aries.WithTransportReturnRoute("all"),
		aries.WithOutboundTransports(ws.NewOutbound()),
		aries.WithStoreProvider(mem.NewProvider()),
		aries.WithProtocols(messagepickupSvc.ServiceCreator(nil), basicmessageSvc.ServiceCreator()),
	)

	if err != nil {
		return "", err
	}

	ctx, err := framework.Context()
	if err != nil {
		return "", err
	}

	client, err := didexchange.New(ctx)
	if err != nil {
		return "", errors.Wrap(err, "failed to create client")
	}

	//copied from mobile.go
	actionCh := make(chan service.DIDCommAction)
	err = client.RegisterActionEvent(actionCh)
	if err != nil {
		return "", errors.Wrap(err, "unable to register with didexchange")
	}

	go service.AutoExecuteActionEvent(actionCh)

	hs := &didexchange.Invitation{}
	err = json.Unmarshal([]byte(invite), hs)
	if err != nil {
		log.Println("parse invitation failed", invite)
		return "", errors.New(fmt.Sprint("bad json ", HostIP, " fart"))
	}

	connID, err := client.HandleInvitation(hs)
	if err != nil {
		return "", errors.New("failed to handle invitation")
	}

	return connID, nil
}
