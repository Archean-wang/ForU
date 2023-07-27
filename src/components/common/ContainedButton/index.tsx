import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography } from "@mui/material";

interface ContainedButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: any;
  color?: string;
  children: React.ReactNode;
}

function ContainedButton({
  onClick,
  icon,
  color = "success",
  children,
}: ContainedButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      color="success"
      sx={{
        gap: 1,
        padding: 2,
        minWidth: 20,
        height: "2rem",
        "@media (max-width: 700px)": {
          ".buttonText": { display: "none" },
        },
        ".MuiButton-startIcon": {
          margin: 0,
        },
        justifyContent: "center",
      }}
      startIcon={<FontAwesomeIcon icon={icon} color={color} />}>
      <Typography className="buttonText" noWrap>
        {children}
      </Typography>
    </Button>
  );
}

export default ContainedButton;
