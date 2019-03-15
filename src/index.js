import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {Provider} from 'react-redux';
import {store} from './state';

const theme = createMuiTheme({});

function render() {
ReactDOM.render(
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>


        <App />
</MuiThemeProvider>
            </Provider> 
        , document.getElementById('root'));
}
render();

if (module.hot) {
    module.hot.accept(['./App'], render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
