export interface StoreRootConfig {
    dirname: string;
}

export interface StoreFeatureConfig {
    filename: string;
}

export type StoreConfig = Partial<StoreRootConfig & StoreFeatureConfig>;

export const defaultDirName = 'store';
export const defaultFileName = 'data.json';
export const STORE_CONFIG_TOKEN = 'STORE_CONFIG';
