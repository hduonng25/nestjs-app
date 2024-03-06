import logger from 'src/logger/configs/logger';

export const configs = () => ({
    service: 'nestjs-app',
    environment: 'dev',
    app: {
        prefix: process.env.PREFIX || '/api/v1',
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT,
    },

    mongoUri: process.env.MONGO_URI || '',

    keys: {
        private_key: process.env.PRIVATE_KEY || '',
        public_key: process.env.PUBLIC_KEY || '',
    },
});
