import { DynamicModule, Module } from '@nestjs/common';
import { StoreService } from './store.service';
import {
    StoreFeatureConfig,
    StoreRootConfig,
    defaultDirName,
    defaultFileName,
    STORE_CONFIG_TOKEN,
    StoreConfig,
} from './config';

let rootStoreConfig: StoreConfig;

@Module({
    providers: [StoreService],
    exports: [StoreService],
})
class RootStoreModule {}

@Module({})
export class StoreModule {
    //forRoot se chay dau tien khi nestjs-app duoc khoi tao
    public static forRoot(storeRootConfig?: StoreRootConfig): DynamicModule {
        //Khi chay neu khong truyen dirname vao thi mac dinh dirname = 'store'
        rootStoreConfig = this.createConfig(storeRootConfig);
        //Gan gia tri vao doi tuong rootStoreConfig
        return {
            module: RootStoreModule,
            providers: [
                {
                    provide: STORE_CONFIG_TOKEN,
                    useValue: rootStoreConfig,
                },
                StoreService,
            ],
        };
    }

    public static forFeature(
        storeFeatureConfig: StoreFeatureConfig,
    ): DynamicModule {
        //Tiep theo se chay den forFeature vi vay trong forFeature khong can phai co module RootStoreModule
        const token = 'STORE_SERVICE' + storeFeatureConfig.filename;
        return {
            module: StoreModule,
            providers: [
                {
                    provide: token,
                    useFactory: () => {
                        const featureStoreConfig = this.createConfig({
                            ...rootStoreConfig,
                            ...storeFeatureConfig,
                            //Tao mot doi tuong moi voi du lieu dirname da co o forRoot, convert lai voi du lieu filename duoc truyen vao
                        });
                        //tra lai mot doi tuong StoreService moi voi constuctor trong StoreService la StoreConfig
                        return new StoreService(featureStoreConfig);
                    },
                },
            ],
            exports: [token],
        };
    }

    private static createConfig(config: StoreConfig): StoreConfig {
        const defaultConfig: StoreConfig = {
            dirname: defaultDirName,
            filename: defaultFileName,
        };
        //Toan tu
        //...defaultConfig de lay ra toan bo du lieu cua cac truong dirname va filename trong defaultFileName
        //tao ra obj moi, roi thay the du lieu cua cac truong do thanh du lieu moi trong ...config
        //Khi su dung, se tu dong xem trong ...config co du lieu nao moi thi se thay the vao trong ...defaultConfig
        return { ...defaultConfig, ...config };
    }
}
