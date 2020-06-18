.PHONY := clean tools

LEPUS_ROOT=$(abspath .)

init:
	@echo "🌈  Making script executable"
	@cd scripts && chmod +x *.sh

clean:
	@./scripts/clean.sh

tools:
	go get golang.org/x/mobile/cmd/gomobile
	gomobile init

local:
	@./scripts/create-local-config.sh

android-aar: clean local
	@./scripts/android.sh

ios-framework: clean local
	@./scripts/ios.sh

run-ios: ios-framework
	@npx react-native run-ios

run-android: android-aar
	npx react-native run-android

debug:
	@echo "🐛  Running debug server"
	@cd go/cmd/debug && go run debug.go
