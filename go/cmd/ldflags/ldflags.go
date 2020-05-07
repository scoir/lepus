package main

import (
	"fmt"
)

//export HOST_IP=172.16.1.1 && go build -ldflags "-X main.HostIP=HOST_IP"

var HostIP string

func main() {
	fmt.Printf("poop %s", HostIP)
}
