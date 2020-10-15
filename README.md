# Lepus

Reference implementation for a reactive native application invoking the Aries Go SDK.

This project demonstrates how Aries Go can be called in a mobile application, it is not intended to a robust solution of any kind.

## Architecture

![Architecture](/static/lepus.png?raw=true "Lepus Architecture")

### configure things

Build the [aries go framework](https://github.com/hyperledger/aries-framework-go) mobile bindings by cloning that repository and
following the instructions in `/cmd/aries-agent-mobile/`.  Set the location of aries-framework-go in `scripts/lepus.sh`

Start the Aries Rest Agent in `cmd/aries-agent-rest`.

Right now the location of the Aries Rest Agent endpoints are hardcoded in `CanisModule.java` for android.  Change these values
to match the configuration of the rest agent started above.   

```
        opts.setAgentURL("http://10.0.2.2:5533");
        opts.setWebsocketURL("ws://10.0.2.2:5533/ws");
```

Those two values should be moved to settings screen to allow this wallet to be configured at runtime.
    
### run things

    npm i
    npx react-native start
    make run-ios
    make run-android


### what's not included

The network this application connects to. 
 
A ledger created with the [von-network](https://github.com/bcgov/von-network) and the Aries Rest Agent from [aries go framework](https://github.com/hyperledger/aries-framework-go)

### acknowledgements
`config.shlib` - is an answer from [stackexchange](https://unix.stackexchange.com/questions/175648/use-config-file-for-my-shell-script)

### attribution
Photo by Fabrice Villard on Unsplash