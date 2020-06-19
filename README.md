# Lepus

Reference implementation for a reactive native application invoking the Aries Go SDK.

Currently, the project relies on a PR pending branch fo the Aries Go framework https://github.com/hyperledger/aries-framework-go/pull/1926

This project demonstrates how Aries Go can be called in a mobile application, it is not intended to a robust solution of any kind.

### build things

    npm i
    make ios-framework
    make android-aar
    
### run things

    make run-ios
    make run-android


### what's not included

The network this application connects to, but it can be created the [von-network](https://github.com/bcgov/von-network) and the [aries go framework](https://github.com/hyperledger/aries-framework-go)

### acknowledgements
`config.shlib` - is an answer from [stackexchange](https://unix.stackexchange.com/questions/175648/use-config-file-for-my-shell-script)

### attribution
Photo by Fabrice Villard on Unsplash