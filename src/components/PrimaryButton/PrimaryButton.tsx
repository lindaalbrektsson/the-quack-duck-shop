import Button from "@mui/material/Button";
import type { ReactNode } from "react";

import "./PrimaryButton.css";

interface PrimaryButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
}

function PrimaryButton({
  children,
  type = "button",
 }: PrimaryButtonProps) {
  return (
    <Button 
    type={type}
    variant="contained"
    disableElevation
    className="primary-button"
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;
