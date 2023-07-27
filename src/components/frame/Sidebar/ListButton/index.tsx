import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";

interface ListButtonProps {
  primary: string;
  icon: IconProp | React.ReactNode;
  iconColor?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

function ListButton({
  primary,
  icon,
  onClick,
  onContextMenu,
  iconColor = "inherit",
}: ListButtonProps) {
  return (
    <>
      <ListItemButton
        title={primary}
        onContextMenu={onContextMenu}
        onClick={onClick}
        sx={{
          mb: 1.5,
          height: "2rem",
          "& > .MuiListItemIcon-root": {
            minWidth: "20px",
          },
          "@media (max-width: 800px)": {
            ".MuiListItemText-root": { display: "none" },
          },
        }}>
        <ListItemIcon
          sx={{
            alignItems: "center",
            color: iconColor,
          }}>
          {React.isValidElement(icon) ? (
            icon
          ) : (
            <FontAwesomeIcon icon={icon as IconProp} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={primary}
          sx={{
            pl: 1,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        />
      </ListItemButton>
    </>
  );
}

export default ListButton;
