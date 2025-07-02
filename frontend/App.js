import React from 'react';
import HomeScreen from './screens/HomeScreen';
// Add this line to your `index.js`
import 'react-native-get-random-values'

/**
 * The main App component.
 * @returns {React.ReactElement} The JSX element to render.
 */
export default function App() {
  return (
    /**
     * The HomeScreen component displays a "Welcome!" message.
     * @type {React.ReactElement}
     */
    <HomeScreen />
  );
}
