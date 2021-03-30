
export const CreateWallet = () => {
    let wallet = {cloudAgentId: ""}

    const setCloudAgentId = (agentId) => {
        wallet = {cloudAgentId: agentId}
    }

    const getCloudAgentId = () => {
        return wallet.cloudAgentId;
    }

    return {
        wallet,
        setCloudAgentId,
        getCloudAgentId,
    }
}