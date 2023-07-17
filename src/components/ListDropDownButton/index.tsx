import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

interface ListDropDownButtonProps {
  title: string;
  children: React.ReactNode;
  icon: any;
}

function ListDropDownButton({
  title,
  children,
  icon,
}: ListDropDownButtonProps) {
  const [open, setOpen] = useState(false);
  function handleClick() {
    setOpen(!open);
  }
  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          gap: 2,
          mb: 1,
          height: "2rem",
          "@media (max-width: 800px)": {
            ".MuiListItemText-root": { display: "none" },
            // ".dropMenuIndicator": { display: "none" },
          },
        }}>
        <ListItemIcon
          sx={{
            alignItems: "center",
            width: 16,
            minWidth: 16,
          }}>
          <FontAwesomeIcon icon={icon} />
        </ListItemIcon>
        <ListItemText
          primary={title}
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        />
        <ListItemIcon
          className="dropMenuIndicator"
          sx={{
            alignItems: "center",
            width: 16,
            minWidth: 16,
          }}>
          {open ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} />
          )}
        </ListItemIcon>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {children}
        </List>
      </Collapse>
    </>
  );
}

export default ListDropDownButton;
