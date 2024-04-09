import {atom, selector, useRecoilValue } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom} = recoilPersist({
    key: 'recoil-persist', // this key is using to store data in local storage
    storage: localStorage, // configure which storage will be used to store the data
    converter: JSON // configure how values will be serialized/deserialized in storage
});

export const userAtom = atom({
    key: 'user',
    default: selector({
        key: 'user/default',
        get: () => 'cfc555e0-4c96-4b1e-b50e-b858bd600686',
    }),
});

export const currentUserAtom = atom({
    key: 'userInfo',
    default: null,
    effects_UNSTABLE: [persistAtom]
});

export const useUser = () => useRecoilValue(userAtom);
