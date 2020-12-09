import { DataGrid, ColDef } from "@material-ui/data-grid";

const columns: ColDef[] = [
  {
    field: "",
    headerName: "#",
    width: 20,
    valueGetter: (params) => params.rowIndex + 1,
    sortable: false,
  },
  { field: "trackName", headerName: "Track Name", flex: 6 },
  {
    field: "plays",
    headerName: "Plays",
    flex: 2,
  },
  {
    field: "artistName",
    headerName: "Artist",
    flex: 4,
  },
];

const TrackTable = ({ data }) => {
  return (
    <div style={{ height: "800px", maxWidth: "500px", margin: "auto" }}>
      <h3>Most Played Songs</h3>
      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        pageSize={10}
        hideFooterSelectedRowCount
      />
    </div>
  );
};

export default TrackTable;
