import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom} = recoilPersist({
    key: 'recoil-persist', // this key is using to store data in local storage
    storage: localStorage, // configure which storage will be used to store the data
    converter: JSON // configure how values will be serialized/deserialized in storage
});


export const currentUserAtom = atom({
    key: 'userInfo',
    default: null,
    effects_UNSTABLE: [persistAtom]
});
