import Rx from 'rxjs/Rx';
import {encodeURLSafe as encodeB64} from "@stablelib/base64";
import {encode as encodeUTF} from '@stablelib/utf8'
import {generateKeyPair, generateKeyPairFromSeed, sign as edSign} from '@stablelib/ed25519'


export const CreateKeyManager = () => {
    let keyPair = generateKeyPairFromSeed(encodeUTF("ArwXoACJgOleVZ2PY7kXn7rA0II0mHYD"));
    let nextPair = generateKeyPairFromSeed(encodeUTF("A6zz7M08-HQSFq92sJ8KJOT2cZ47x7pX"));

    const keys = new Rx.BehaviorSubject({signingKey: keyPair, nextKey: nextPair})

    const rotate = () => {
        let nextPair = generateKeyPair();
        let cur = keys.getValue();
        keys.next({signingKey: cur.nextKey, nextKey: nextPair})
    }

    const sign = (data) => {
        let cur = keys.getValue();
        return edSign(cur.signingKey.secretKey, encodeUTF(data));
    }

    const publicKey = () => {
        let cur = keys.getValue();
        return cur.signingKey.publicKey
    }

    const nextKey = () => {
        let cur = keys.getValue();
        //TODO: hash the next key into a Blake3 digest
        return cur.nextKey.publicKey
    }

    return {
        keys,
        rotate,
        sign,
        publicKey,
        nextKey,
    }
}