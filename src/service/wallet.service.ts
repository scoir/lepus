import Rx from 'rxjs/Rx';
import {encode as encodeBase64} from "@stablelib/base64";
import firestore from '@react-native-firebase/firestore';


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