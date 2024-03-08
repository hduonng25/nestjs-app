import { Inject, Injectable, Optional } from '@nestjs/common';
import * as fs from 'fs';
import { STORE_CONFIG_TOKEN, StoreConfig } from './config';

@Injectable()
export class StoreService {
    constructor(
        @Optional()
        @Inject(STORE_CONFIG_TOKEN)
        private storeConfig: StoreConfig,
    ) {
        if (storeConfig && !fs.existsSync(storeConfig.dirname)) {
            fs.mkdirSync(storeConfig.dirname);
        }
    }

    save(data: any): void {
        fs.appendFileSync(
            `${this.storeConfig.dirname}/ ${this.storeConfig.filename}`,
            JSON.stringify(data),
        );
    }
}
