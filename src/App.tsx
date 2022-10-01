import React from 'react';
import TextTile, { TileColor } from './components/TextTile/TextTile';

function App() {
    return (
        <div className='app'>
            <div className='tile-container'>
                <TextTile text={'Webpack'} backgroundColor={TileColor.BLUE} />
                <TextTile text={'+'} backgroundColor={TileColor.GREEN} />
                <TextTile text={'TypeScript'} backgroundColor={TileColor.ORANGE} />
                <TextTile text={'+'} backgroundColor={TileColor.WHITE} />
                <TextTile text={'React'} backgroundColor={TileColor.YELLOW} />
            </div>
        </div>
    )
}

export default App;