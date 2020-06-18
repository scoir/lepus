export class Connection {

    constructor(
        readonly ConnectionID: string,
        readonly State: string,
        readonly ThreadID: string,
        readonly ParentThreadID: string,
        readonly TheirLabel: string,
        readonly TheirDID: string,
        readonly MyDID: string,
        readonly ServiceEndPoint: string,
        readonly RecipientKeys: [string],
        readonly RoutingKeys: [string],
        readonly InvitationID: string,
        readonly InvitationDID: string,
        readonly Implicit: boolean,
        readonly Namespace: string,
    ) {

    }
}
