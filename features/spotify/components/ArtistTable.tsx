import { DataGrid, ColDef, SortDirection } from "@material-ui/data-grid";
import { getHoursAndMinutes } from "features/spotify/utils";

const columns: ColDef[] = [
  {
    field: "",
    headerName: "#",
    width: 20,
    valueGetter: (params) => params.rowIndex + 1,
    sortable: false,
  },
  { field: "artistName", headerName: "Artist Name", flex: 3 },
  {
    field: "playCount",
    headerName: "Play Count",
    flex: 2,
  },
  {
    field: "trackNames",
    headerName: "Unique Songs",
    flex: 2,
    valueGetter: (params) => params.row.trackNames.size,
    renderCell: (params) => {
      return <div>{params.row.trackNames.size}</div>;
    },
  },
  {
    field: "msPlayed",
    headerName: "Play Time",
    flex: 2,
    valueFormatter: (params) => {
      return getHoursAndMinutes(params.row.msPlayed);
    },
  },
];

const sortModel = [{ field: "playCount", sort: "desc" as SortDirection }];

const ArtistTable = ({ data }) => {
  return (
    <div style={{ height: "700px", maxWidth: "600px", margin: "auto" }}>
      <h3>Top 100 Artists (by Play Count)</h3>

      <DataGrid
        autoHeight
        rows={data}
        sortModel={sortModel}
        columns={columns}
        pageSize={10}
        hideFooterSelectedRowCount
      />
    </div>
  );
};

export default ArtistTable;
