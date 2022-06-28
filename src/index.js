import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.scss';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);