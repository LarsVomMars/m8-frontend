export enum Permissions {
    TN,
    M,
    ID,
    SDA,
}

export enum ApiPermissions {
    READ,
    WRITE,
    ADMIN,
}

export type EO = Record<string, never>;

export interface IBasicProduct {
    name: string;
    price: number;
    amount: number;
    bottles_per_crate: number;
    permission: Permissions;
}

export interface IProduct extends IBasicProduct {
    _id: string;
}

export type IProducts = Record<string, IBasicProduct>;
