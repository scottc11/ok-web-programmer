import React from "react";
import "./Instructions.scss";
import { instructionsProps } from "../../typescriptHelperFiles/models";

export const Instructions: React.FC<instructionsProps> = ({
  areInstructionsDisplayed,
  setAreInstructionsDisplayed,
}: instructionsProps) => {
  return (
    <>
      {areInstructionsDisplayed ? (
        <div className="instructionsContainer">
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat
            dolore debitis laboriosam? Facere inventore, laboriosam fugiat nemo
            provident minus dolorum perspiciatis sit, officia officiis vero,
            odit vel blanditiis nostrum omnis.
          </div>
          <div>
            1) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            2) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            3) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            4) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            5) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            6) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            7) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            8) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            9) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            10) Lorem, ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </div>
          <div>
            <button
              onClick={() =>
                setAreInstructionsDisplayed(!areInstructionsDisplayed)
              }
            >
              close
            </button>
          </div>
        </div>
      ) : (
        <div className="btnContainer">
          <button
            onClick={() =>
              setAreInstructionsDisplayed(!areInstructionsDisplayed)
            }
          >
            Getting Started
          </button>
        </div>
      )}
    </>
  );
};
