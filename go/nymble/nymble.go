package nymble

import (
	"encoding/json"
	"time"
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

// Poop synchronous call
//
//noinspection GoUnusedExportedFunctions
func ReturnString() string {
	return "poopie mcpooppants"
}

// ReturnPrimitive example
//
//noinspection GoUnusedExportedFunction
func ReturnPrimitive() int {
	return 42
}

// ReturnStruct we stringify due to the restrictions in the react bridge, we'll unmarshall in JS
//
//noinspection GoUnusedExportedFunction
func ReturnStruct() (string, error) {
	b, err := json.Marshal(&Foo{
		Bar:   42,
		Baz:   "hihihi",
		Barry: []int{420, 69},
		Billy: nil,
	})

	if err != nil {
		return "", err
	}

	return string(b), nil
}

type Foo struct {
	Bar   int
	Baz   string
	Barry []int
	Billy *AnotherStruct
}

type AnotherStruct struct {
	Poop string
}
