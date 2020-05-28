package main

import (
	"fmt"

	"pkg/cmd/ldflags/nym"
)

//export HOST_IP=172.16.1.1 && go build -ldflags "-X pkg/cmd/ldflags/nym.HostIP=$HOST_IP"

var HostIP string

func main() {
	fmt.Println(nym.IP())
}
