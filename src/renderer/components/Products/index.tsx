/* eslint-disable react/no-unused-state */

import React from "react";
import {
    DataGrid,
    GridEditRowProps,
    GridRowModel,
    GridToolbarContainer,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";

import type { AxiosError } from "axios";
import type {
    GridColumns,
    GridEditRowsModel,
    GridRowData,
    GridCellParams,
    GridRowId,
} from "@mui/x-data-grid";

import type { EO, IBasicProduct, IProduct, IProducts } from "../types";
import { APermissions as Permissions, EPermissions } from "../types";

import { getURL, getKey } from "../util";

export const renderPermission = (params: GridCellParams) => (
    <div>{Permissions[Number(params.value)]}</div>
);

export default class Products extends React.Component<EO, ProductsState> {
    constructor(props: EO) {
        super(props);
        this.state = { products: {}, rows: [], model: {} };
    }

    componentDidMount = async () => {
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.get(`${URL}/api/products/`, {
                headers: { Authorization: `Bearer ${KEY}` },
            });

            const products = this.parseProducts(resp.data.products);

            const rows: GridRowData[] = [];
            // rows.push("asdf");
            console.log(rows, products);
            for (const [id, product] of Object.entries(products)) {
                rows.push({
                    id,
                    crates: Math.floor(product.amount),
                    bottles: (product.amount % 1) * product.bottles_per_crate,
                    ...product,
                });
            }
            console.log("HELP:", rows);
            this.setState({ rows });

            console.log(resp.data);
        } catch (e) {
            console.log(e);
            console.error((e as AxiosError).response);
        }
    };

    onChange = (model: GridRowModel) => {
        this.setState({ model });
    };

    onCommit = (id: GridRowId) => {
        const { model: rowModel } = this.state;
        if (Object.prototype.hasOwnProperty.call(rowModel, id)) {
            const product = this.buildBasicProduct(rowModel[id]);
            if (id === "addrow") {
                this.add(product);
            } else {
                this.save({ _id: id as string, ...product });
            }
        }
    };

    add = async (product: IBasicProduct) => {
        console.log(product);
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.post(`${URL}/api/products/`, product, {
                headers: { Authorization: `Bearer ${KEY}` },
            });
            console.log(resp);
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

    save = async (product: IProduct) => {
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.put(`${URL}/api/products/`, product, {
                headers: { Authorization: `Bearer ${KEY}` },
            });
            // TODO: Return updated products object
            console.log(resp);
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

    private buildBasicProduct = (model: GridEditRowProps): IBasicProduct => ({
        name: model.name.value as string,
        price: model.price.value as number,
        amount:
            (model.crates.value as number) +
            (model.bottles.value as number) / (model.bottles_per_crate.value as number),
        bottles_per_crate: model.bottles_per_crate.value as number,
        permission: model.permission.value as EPermissions,
    });

    private parseProducts = (prods: IProduct[]) => {
        const products: IProducts = {};
        // eslint-disable-next-line
        for (const { _id, ...prod } of prods) products[_id] = prod;
        this.setState({ products });
        return products;
    };

    private handleToolbar = async () => {
        const row = {
            id: "addrow",
            name: "Name",
            price: 0,
            crates: 0,
            bottles: 0,
            bottles_per_crate: 0,
            permission: EPermissions.TN,
        };
        const { rows } = this.state;
        const nrows = [...rows, row];
        this.setState({ rows: nrows });
    };

    private toolbar = () => {
        // const handleClick = () => console.log(apiRef);
        return (
            <GridToolbarContainer>
                <Button
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={this.handleToolbar}
                >
                    Add record
                </Button>
            </GridToolbarContainer>
        );
    };

    render() {
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
                field: "bottles_per_crate",
                headerName: "Bottles per crate",
                editable: true,
                type: "number",
                width: 150,
            },
            {
                field: "permission",
                headerName: "Permission",
                editable: true,
                width: 150,
                type: "number",
                renderCell: renderPermission,
            },
        ];

        const { rows, model } = this.state;

        return (
            <div className="page-div">
                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        editRowsModel={model}
                        onEditRowsModelChange={this.onChange}
                        onRowEditCommit={this.onCommit}
                        components={{
                            Toolbar: this.toolbar,
                        }}
                    />
                </div>
            </div>
        );
    }
}

export interface ProductsState {
    products: IProducts;
    rows: GridRowData[];
    model: GridEditRowsModel;
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
