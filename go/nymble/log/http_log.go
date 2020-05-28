// +build debug

package log

import (
	"encoding/base64"
	"fmt"
	"net/http"

	"pkg/nymble/config"
)

func Println(v ...interface{}) {
	_, _ = http.Get(fmt.Sprintf("http://%s:%s/log/%s", config.DebugIP, config.DebugPort,
		base64.StdEncoding.EncodeToString([]byte(fmt.Sprintln(v...)))))

}
