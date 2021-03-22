import Rx from 'rxjs/Rx';


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