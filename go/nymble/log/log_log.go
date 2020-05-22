// +build !debug

package log

import (
	"log"
)

func Println(v ...interface{}) {
	log.Println(v)
}
