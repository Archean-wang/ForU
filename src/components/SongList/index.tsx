import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { startPlayback } from "../../api";

const Cell = styled(TableCell)(
  ({ theme }) => `
            border: 0
        `
);

type Render = (args: any) => JSX.Element;
interface ColumnDefine {
  header: string;
  field: string;
  render: Render | undefined;
}
type KeyGetter = (v: any) => string;

interface Info {
  items: any[];
  uri: string;
  columns: ColumnDefine[];
  rowKey: KeyGetter;
}

export default function SongList({ items, uri, columns, rowKey }: Info) {
  const uriType = uri.split(":")[1];
  function startPlay(index: number) {
    startPlayback(uri, index).then(() => {
      console.log(`${uri} @ ${index}`);
    });
  }
  return (
    <TableContainer
      sx={{
        width: "100%",
        borderRadius: 2,
        bgcolor: "#f3f2f1",
        overflow: "auto",
      }}>
      <Table padding="normal">
        <TableHead>
          <TableRow>
            <TableCell align="left">#</TableCell>
            {columns.map((v) => (
              <TableCell align="left">{v.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={rowKey(item)}
              hover
              onDoubleClick={() => startPlay(index)}>
              <Cell component="th" scope="row">
                {index + 1}
              </Cell>
              {columns.map((v) => (
                <Cell component="th" scope="row">
                  {v.render ? v.render(item[v.field]) : item[v.field]}
                </Cell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
