export class Credential {

    constructor(
        readonly name: string,
        readonly something: string,
    ) {

    }

    static mocked(): Credential {
        return new Credential(
            'Transcript',
            'yay',
        );
    }
    static mockedAgain(): Credential {
        return new Credential(
            'GPA',
            '4.0',
        );
    }
    static mockedAgainAgain(): Credential {
        return new Credential(
            'recommendation',
            '???',
        );
    }
}