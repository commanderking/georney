import { DataGrid, ColDef } from "@material-ui/data-grid";
import { getHoursAndMinutes } from "features/spotify/utils";
import Popover from "@material-ui/core/Popover";

const columns: ColDef[] = [
  {
    field: "",
    headerName: "#",
    width: 20,
    valueGetter: (params) => params.rowIndex + 1,
    sortable: false,
  },
  { field: "artistName", headerName: "Artist Name", flex: 4 },
  {
    field: "msPlayed",
    headerName: "Play Time",
    flex: 2,
    valueFormatter: (params) => {
      return getHoursAndMinutes(params.row.msPlayed);
    },
  },
  {
    field: "plays",
    headerName: "Tracks Played",
    flex: 2,
  },
  {
    field: "trackNames",
    headerName: "Unique songs",
    flex: 2,
    valueFormatter: (params) => params.row.trackNames.size,
    renderCell: (params) => {
      return <div>{params.row.trackNames.size}</div>;
    },
  },
];

const ArtistTable = ({ data }) => {
  return (
    <div style={{ height: "800px", maxWidth: "500px", margin: "auto" }}>
      <h3>Most Played Artists</h3>

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

export default ArtistTable;
