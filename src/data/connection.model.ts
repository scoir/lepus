export class Connection {

    constructor(
        readonly name: string,
        readonly did: string,
        readonly verkey: string,
    ) {

    }

    static mocked(): Connection {
        return new Connection(
            'Faux',
            'did',
            'verkey',
        );
    }

    static mockedAgain(): Connection {
        return new Connection(
            'Something',
            'diddid',
            'verkeyverkey',
        );
    }

    static mockedAgainAgain(): Connection {
        return new Connection(
            'Else',
            'poop',
            'pee',
        );
    }
}