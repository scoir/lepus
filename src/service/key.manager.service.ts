import {encode as encodeUTF} from '@stablelib/utf8'
import {generateKeyPair, generateKeyPairFromSeed, sign as edSign} from '@stablelib/ed25519'


export const CreateKeyManager = () => {
    let keyPair = generateKeyPairFromSeed(encodeUTF("ArwXoACJgOleVZ2PY7kXn7rA0II0mHYD"));
    let nextPair = generateKeyPairFromSeed(encodeUTF("A6zz7M08-HQSFq92sJ8KJOT2cZ47x7pX"));

    let keys = {signingKey: keyPair, nextKey: nextPair}

    const rotate = () => {
        let nextPair = generateKeyPair();
        let cur = keys;
        keys = {signingKey: cur.nextKey, nextKey: nextPair}
    }

    const sign = (data) => {
        return edSign(keys.signingKey.secretKey, encodeUTF(data));
    }

    const publicKey = () => {
        return keys.signingKey.publicKey
    }

    const nextKey = () => {
        //TODO: hash the next key into a Blake3 digest
        return keys.nextKey.publicKey
    }

    return {
        keys,
        rotate,
        sign,
        publicKey,
        nextKey,
    }
}