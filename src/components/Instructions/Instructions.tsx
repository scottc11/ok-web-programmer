import React from "react";
import "./Instructions.scss";
import { instructionsProps } from "../../typescriptHelperFiles/models";

export const Instructions: React.FC<instructionsProps> = ({
  areInstructionsDisplayed,
  setAreInstructionsDisplayed,
}: instructionsProps) => {
  return (
    <div className="btnContainer">
      <button>Gettin Started</button>
    </div>
  );
};
