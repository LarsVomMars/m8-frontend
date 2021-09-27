import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import type { AxiosError } from "axios";
import type {
    GridColumns,
    GridCellEditCommitParams,
    GridEditCellPropsParams,
    GridRowData,
    GridCellParams,
} from "@mui/x-data-grid";
import type { EO, IProduct, IProducts } from "../types";

import { getURL, getKey, getStateFromURL } from "../util";
import { APermissions as Permissions } from "../types";

import "./Products.scss";

export const renderPermission = (params: GridCellParams) => (
    <div>{Permissions[Number(params.value)]}</div>
);

export default class Products extends React.Component<EO, ProductsState> {
    constructor(props: EO) {
        super(props);
        this.state = { products: {} };
    }

    componentDidMount = async () => {
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.get(`${URL}/api/products/`, {
                headers: {
                    Authorization: `Bearer ${KEY}`,
                },
            });
            this.parseProducts(resp.data.products);
            // this.setState({ products: resp.data.products });
            console.log(resp.data);
        } catch (e) {
            console.error((e as AxiosError).response);
        }

        const newState = getStateFromURL<ProductsState>(this.state);
        this.setState({ ...newState });
    };

    onChange = (params: GridCellEditCommitParams) => {
        const { products } = this.state;
        // WTF AM I DOING
        // eslint-disable-next-line
        // @ts-ignore
        products[params.id][params.field] = params.props.value;
        this.setState({ products });
        this.save({ _id: params.id as string, ...products[params.id] });
    };

    save = async (product: IProduct) => {
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.put(`${URL}/api/products/`, product, {
                headers: { Authorization: `Bearer ${KEY}` },
            });
            console.log(resp);
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

    private parseProducts(prods: IProduct[]) {
        const products: IProducts = {};
        // eslint-disable-next-line
        for (const { _id, ...prod } of prods) products[_id] = prod;
        this.setState({ products });
    }

    render() {
        const { products } = this.state;
        const columns: GridColumns = [
            { field: "name", headerName: "Name", editable: true, width: 150 },
            {
                field: "price",
                headerName: "Price",
                editable: true,
                type: "number",
                width: 150,
            },
            {
                field: "crates",
                headerName: "Crates",
                editable: true,
                type: "number",
                width: 150,
            },
            {
                field: "bottles",
                headerName: "Bottles",
                editable: true,
                type: "number",
                width: 150,
            },
            {
                field: "permission",
                headerName: "Permission",
                editable: true,
                width: 150,
                renderCell: renderPermission,
            },
        ];

        const rows: GridRowData[] = [];

        for (const [id, product] of Object.entries(products)) {
            rows.push({
                id,
                crates: Math.floor(product.amount),
                bottles: (product.amount % 1) * product.bottles_per_crate,
                ...product,
            });
        }

        return (
            <div className="page-div">
                <div style={{ height: 300, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        onCellEditCommit={this.onChange}
                    />
                </div>
            </div>
        );
    }
}

export interface ProductsState {
    products: IProducts;
    model?: GridEditCellPropsParams;
}

export const rowMap = (product: IProduct): GridRowData => ({
    id: product._id,
    crates: Math.floor(product.amount),
    bottles: (product.amount % 1) * product.bottles_per_crate,
    ...product,
});

export const editPermission = () => {
    // TODO: Select like Buy
    return <div>test</div>;
};
