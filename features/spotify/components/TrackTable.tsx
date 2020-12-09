import { DataGrid } from "@material-ui/data-grid";

const columns = [
  { field: "trackName", headerName: "Track Name", width: 200 },
  {
    field: "artistName",
    headerName: "Artist",
    width: 200,
  },
  {
    field: "plays",
    headerName: "Plays",
    width: 200,
  },
];

const TrackTable = ({ data }) => {
  console.log("data", data);
  return (
    <div style={{ height: "800px", width: "80%" }}>
      <DataGrid rows={data} columns={columns} pageSize={100} />
    </div>
  );
};

export default TrackTable;
