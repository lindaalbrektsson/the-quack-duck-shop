import Button from "@mui/material/Button";
import type { ReactNode } from "react";

import "./PrimaryButton.css";

interface PrimaryButtonProps {
  children: ReactNode;
}

function PrimaryButton({ children }: PrimaryButtonProps) {
  return (
    <Button variant="contained" disableElevation className="primary-button">
      {children}
    </Button>
  );
}

export default PrimaryButton;
