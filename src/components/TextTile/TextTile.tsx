import React from "react";
import './TextTile.scss';

export enum TileColor {
    ORANGE,
    YELLOW,
    BLUE,
    GREEN,
    WHITE
}

interface TextTileProps {
    text: string,
    backgroundColor?: TileColor
}

const TextTile = (props: TextTileProps) => {
    const getBackgroundColor = (color: TileColor) => {
        switch (color) {
            case TileColor.BLUE:
                return 'bg--blue';
            case TileColor.WHITE:
                return 'bg--white';
            case TileColor.GREEN:
                return 'bg--green';
            case TileColor.YELLOW:
                return 'bg--yellow';
            case TileColor.ORANGE:
                return 'bg--orange';
            default:
                return '';
        }
    }
    return (
        <div className={`text-tile ${getBackgroundColor(props.backgroundColor)}`}>
            <h1>{props.text}</h1>
        </div>
    )
}

export default TextTile;