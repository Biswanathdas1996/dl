import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateResult } from "../redux/slices/chatSlices";

interface TableProps {
  data: any[];
  loadingUi: boolean;
  chatId: number;
}

const Table: React.FC<TableProps> = ({ data, loadingUi, chatId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const columns: GridColDef[] = Object.keys(data[0] || {}).map((key) => {
    if (key === "fullName") {
      return {
        field: key,
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 160,
      };
    }
    return {
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      width: 130,
    };
  });

  const rows = data.map((item, index) => {
    return { id: index, ...item };
  });

  const handleDeleteColumn = (fields: any) => {
    console.log("======>", fields, data);
    const fieldsData = Object.keys(fields);

    const updatedData = data.map((item) => {
      const newItem = { ...item };
      fieldsData.forEach((field: string) => {
        delete newItem[field];
      });
      return newItem;
    });
    dispatch(
      updateResult({
        chatId,
        result: updatedData,
      })
    );
    console.log("Updated Data: ", updatedData);
    // chatId;
  };

  if (data.length !== 0) {
    return (
      <>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20, 50]}
          checkboxSelection
          filterModel={{
            items: columns.some((col) => col.field === "fullName")
              ? [{ field: "fullName", operator: "contains", value: "" }]
              : [],
          }}
          sx={{
            border: 0,
            "& .css-1n5bvky-MuiDataGrid-root .MuiDataGrid-container--top [role=row]":
              {
                backgroundColor: "black !important",
              },
          }}
          loading={loadingUi}
          onColumnVisibilityModelChange={(params) => {
            handleDeleteColumn(params);
          }}
        />
      </>
    );
  }
};

const paginationModel = { page: 0, pageSize: 5 };

export default Table;
