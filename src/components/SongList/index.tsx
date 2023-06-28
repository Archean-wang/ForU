import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

const Cell = styled(TableCell)(
  ({ theme }) => `
            border: 0;
            max-width: 200px;
            overflow: hidden;
        `
);

type Render = (args: any) => JSX.Element;
interface ColumnDefine {
  header: string;
  field: string;
  render: Render | undefined;
}
type KeyGetter = (v: any) => string;
type Handler = (v: number) => any;
interface Info {
  items: any[];
  columns: ColumnDefine[];
  rowKey: KeyGetter;
  handDoubleClick: Handler;
}

export default function SongList({
  items,
  columns,
  rowKey,
  handDoubleClick,
}: Info) {
  return (
    <TableContainer
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 2,
        bgcolor: "#f3f2f1",
        overflow: "auto",
        // "&::-webkit-scrollbar": {
        //   display: "none",
        // },
      }}>
      <Table padding="normal" size="small">
        <TableHead sx={{ width: "100%" }}>
          <TableRow>
            <TableCell align="left">#</TableCell>
            {columns.map((v, index) => (
              <TableCell align="left" key={index} sx={{ flex: 1 }}>
                {v.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={rowKey(item)}
              hover
              onContextMenu={() => {}}
              onDoubleClick={() => handDoubleClick(index)}>
              <Cell component="th" scope="row">
                {index + 1}
              </Cell>
              {columns.map((v, index) => (
                <Cell component="th" scope="row" key={index}>
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
