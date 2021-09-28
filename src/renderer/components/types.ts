export enum EPermissions {
    TN,
    M,
    ID,
    SDA,
}

export const APermissions: string[] = ["Participant", "Mentor", "Infodesk", "Admin"];

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
    permission: EPermissions;
}

export interface IProduct extends IBasicProduct {
    _id: string;
}

export type IProducts = Record<string, IBasicProduct>;
