export class Connection {

    constructor(
        readonly did: string,
        readonly verkey: string,
    ) {

    }

    static mocked(): Connection {
        return new Connection(
            'did',
            'verkey',
        );
    }
    static mockedAgain(): Connection {
        return new Connection(
            'diddid',
            'verkeyverkey',
        );
    }
    static mockedAgainAgain(): Connection {
        return new Connection(
            'poop',
            'pee',
        );
    }
}