package main

import (
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
)

func main() {
	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		fmt.Println("👋   byeeeee")
		os.Exit(0)
	}()

	http.HandleFunc("/log/", func(_ http.ResponseWriter, req *http.Request) {
		parts := strings.Split(req.URL.String(), "/")
		b, _ := base64.StdEncoding.DecodeString(parts[len(parts)-1])

		log.Println(string(b))
	})

	fmt.Println("👂  Listening on 8910...")
	_ = http.ListenAndServe(":8910", nil)
}
