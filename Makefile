.PHONY := clean tools

ESQUIVE_ROOT=$(abspath .)

init:
	@echo "🌈  Making script executable"
	@cd scripts && chmod +x *.sh

clean:
	@./scripts/clean.sh

tools:
	go get golang.org/x/mobile/cmd/gomobile
	gomobile init

android-aar: clean
	@./scripts/android.sh

ios-framework: clean
	@./scripts/ios.sh

run-ios:
	npx react-native run-ios

run-android:
	npx react-native run-android

debug:
	@echo "🐛  Running debug server"
	@cd go/cmd/debug && go run debug.go
