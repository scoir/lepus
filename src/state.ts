import React from "react";
import {CreateKeyManager} from "./service/key.manager.service";
import {CreateWallet} from "./service/wallet";

export const keyManager = CreateKeyManager();
export const wallet = CreateWallet();

export const state = {
    keyManager: keyManager,
    wallet: wallet,
}

export const StateContext = React.createContext(state)
