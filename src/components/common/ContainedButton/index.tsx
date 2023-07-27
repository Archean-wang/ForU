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
      size="small"
      color="success"
      sx={{
        gap: 1,
        padding: 1.5,
        height: "1.5rem",
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
