// +build debug

package log

import (
	"encoding/base64"
	"fmt"
	"net/http"
)

func Println(v ...interface{}) {
	_, _ = http.Get(fmt.Sprintf("http://192.168.1.234:8910/log/%s",
		base64.StdEncoding.EncodeToString([]byte(fmt.Sprintln(v...)))))
}
