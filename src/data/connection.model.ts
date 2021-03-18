export class Connection {

    constructor(
        readonly id: string,
        readonly state: string,
        readonly ThreadID: string,
        readonly ParentThreadID: string,
        readonly name: string,
        readonly their_did: string,
        readonly my_did: string,
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
