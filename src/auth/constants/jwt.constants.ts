import { configs } from 'src/config';

export const jwtConstants = {
    private: configs().keys.private_key,
    secret: configs().keys.public_key,
};
