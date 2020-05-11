# Esquive

(Archaic) An evasive move to dodge or sidestep the attacker’s attack, generally followed with an attack of your own.

## Prerequisites

* Android Env (and/or)
* iOS Env
* React Native env - https://reactnative.dev/docs/environment-setup
* Yarn
* Gradle

### build things

    npm i
    make ios-framework
    make android-aar
    
### run things

    make run-ios
    make run-android

### check typescripty things?
    yarn tsc

### dependencies
Nymble and Allez access

    go env -w GOPRIVATE=github.com/scoir/*
    git config --global url."https://<Personal Access Token from Github>:x-oauth-basic@github.com/".insteadOf "https://github.com/"
    
### stuff griff is saving

publish async
```
NativeModules.Nymble.asyncHello(() => {})
```

register for async
```
DeviceEventEmitter.addListener('default', (message) => {
    console.log(message)
});
```

### attribution
Photo by Fabrice Villard on Unsplash