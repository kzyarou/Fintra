import React from 'react';
import './index.css';
import { render } from 'react-dom';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);