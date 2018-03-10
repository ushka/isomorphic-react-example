/**
* This is the main entry point of the client application and is loaded by Webpack.
* It is NOT loaded by the server at any time as the configurations used (i.e.,browserHistory) only work in the client context.
* The server may load the App component when server rendering.
*/
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import getStore from './getStore';
import { Provider } from 'react-redux';

const store = getStore();

const fetchDataForLocation = () => {
	store.dispatch({type: `REQUEST_FETCH_QUESTIONS`});
}

const render = (_App) => {
  ReactDOM.render(
    <Provider store={store}>
    	<_App />
    </Provider>,
    document.getElementById('AppContainer')
  )
}

if(module.hot) {
	module.hot.accept('./App', () => {
		const NextApp = require('./App').default;
		render(NextApp);
	})
}

store.subscribe(() => {
	const state = store.getState();
	if(state.questions.length > 0) {
		console.info("Mounting app");
		render(App);
	} else {
		console.info("App not yet mounting");
	}
});

fetchDataForLocation();
