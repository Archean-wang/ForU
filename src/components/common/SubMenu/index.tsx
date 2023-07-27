import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface SubMenuProps {
  title: string;
  children: React.ReactNode;
}

function SubMenu({ children, title }: SubMenuProps) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const menu = useRef<HTMLUListElement | null>(null);
  const [toLeft, setToLeft] = useState(-1);
  const [toTop, setToTop] = useState(-1);

  useEffect(() => {
    setToLeft(
      (menu.current?.getBoundingClientRect().right as number) -
        window.innerWidth
    );
    setToTop(
      (menu.current?.getBoundingClientRect().top as number) - window.innerHeight
    );
    setShow(open);
  }, [open]);

  return (
    <MenuItem
      dense
      sx={{ display: "flex", justifyContent: "space-between" }}
      onMouseEnter={() => {
        setOpen(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
      }}>
      {title}
      <FontAwesomeIcon icon={faAngleRight} />
      <List
        ref={menu}
        sx={{
          padding: 0,
          margin: 0,
          backgroundColor: "popover",
          position: "absolute",
          left: toLeft > 0 ? `-${menu.current?.offsetWidth}px` : "100%",
          top: toTop > 0 ? `-${toTop}px` : "initial",
          visibility: show ? "visible" : "hidden",
          borderRadius: 1,
          boxShadow: 5,
        }}>
        {children}
      </List>
    </MenuItem>
  );
}

export default SubMenu;
