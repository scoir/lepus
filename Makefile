.PHONY := clean tools

LEPUS_ROOT=$(abspath .)

init:
	@echo "🌈  Making script executable"
	@cd scripts && chmod +x *.sh

clean:
	@./scripts/clean.sh

android-aar: clean
	@./scripts/android.sh

ios-framework: clean
	@./scripts/ios.sh

run-ios: ios-framework
	@npx react-native run-ios

run-android:
	npx react-native run-android
