import { Box, List } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Anchor } from "../../../utils/interface";

interface ContextMenuProps {
  anchorPosition: Anchor | null;
  children: React.ReactNode;
  onClose: Function;
}

function ContextMenu({ anchorPosition, children, onClose }: ContextMenuProps) {
  const menu = useRef<HTMLUListElement | null>(null);
  const [show, setShow] = useState(false);
  const [toLeft, setToLeft] = useState<number | undefined>(undefined);
  const [toTop, setToTop] = useState<number | undefined>(undefined);

  useEffect(() => {
    let menuw = menu.current?.offsetWidth as number;
    let menuh = menu.current?.offsetHeight as number;
    let parent = menu.current?.parentElement as HTMLElement;
    setToLeft(
      (anchorPosition?.mouseX as number) + menuw >
        parent?.getBoundingClientRect().right
        ? (anchorPosition?.mouseX as number) - menuw
        : anchorPosition?.mouseX
    );

    setToTop(
      (anchorPosition?.mouseY as number) + menuh >
        parent.getBoundingClientRect().bottom
        ? (anchorPosition?.mouseY as number) - menuh
        : anchorPosition?.mouseY
    );

    setShow(Boolean(anchorPosition));
  }, [anchorPosition]);

  return (
    <>
      <Box
        onClick={() => {
          onClose();
        }}
        sx={{
          display: anchorPosition ? "flex" : "none",
          height: "100vh",
          width: "100vw",
          opacity: 0,
          position: "fixed",
          left: 0,
          top: 0,
        }}></Box>
      <List
        ref={menu}
        sx={{
          backgroundColor: "popover",
          boxShadow: 5,
          padding: 0,
          margin: 0,
          visibility: show ? "visible" : "hidden",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: toLeft,
          top: toTop,
          borderRadius: 1,
          zIndex: 1000,
        }}>
        {children}
      </List>
    </>
  );
}

export default ContextMenu;
