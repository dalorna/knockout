import {atom, selector, useRecoilValue} from 'recoil';

export const userAtom = atom({
    key: 'user',
    default: selector({
        key: 'user/default',
        get: () => 'cfc555e0-4c96-4b1e-b50e-b858bd600686',
    }),
});
export const useUser = () => useRecoilValue(userAtom);