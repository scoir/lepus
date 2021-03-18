import Rx from 'rxjs/Rx';
import {encode as encodeUTF} from '@stablelib/utf8'
import {generateKeyPair, generateKeyPairFromSeed, sign as edSign} from '@stablelib/ed25519'


export const CreateWallet = () => {
    const wallet = new Rx.BehaviorSubject({cloudAgentId: ""})

    const setCloudAgentId = (agentId) => {
        wallet.next({cloudAgentId: agentId})
    }

    const getCloudAgentId = () => {
        let w = wallet.getValue();
        return w.cloudAgentId;
    }

    return {
        wallet,
        setCloudAgentId,
        getCloudAgentId,
    }
}