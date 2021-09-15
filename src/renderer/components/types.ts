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

export interface IProduct {
    _id: string;
    name: string;
    price: number;
    amount: number;
    bottles_per_crate: number;
    permission: Permissions;
}
