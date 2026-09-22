import Button from "@mui/material/Button";
import type { MouseEventHandler, ReactNode } from "react";
import "./PrimaryButton.css";

interface PrimaryButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function PrimaryButton({
  children,
  type = "button",
  onClick,
}: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant="contained"
      disableElevation
      className="primary-button"
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;
