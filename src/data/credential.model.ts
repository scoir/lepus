export class Credential {

    constructor(
        readonly comment: string,
        readonly credential_id: string,
        readonly issuer_label: string,
        readonly status: string,
        readonly body: object
    ) {
    }

    statusString () {
        if (this.status === "offered") {
            return "Offered by " + this.issuer_label;
        } else if (this.status === "accepted") {
            return "Pending Issuance from " + this.issuer_label;
        } else if (this.status === "issued") {
            return "Issued by " + this.issuer_label;
        }
    }
}