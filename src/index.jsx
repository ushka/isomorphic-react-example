/**
* This is the main entry point of the client application and is loaded by Webpack.
* It is NOT loaded by the server at any time as the configurations used (i.e.,browserHistory) only work in the client context.
* The server may load the App component when server rendering.
*/
import App from './App';
import ReactDOM from 'react-dom';
import React from 'react';
import getStore from './getStore';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();
const store = getStore(history);

if(module.hot) {
	module.hot.accept('./App', () => {
		const NextApp = require('./App').default;
		render(NextApp);
	})
}

const fetchDataForLocation = location => {
	if (location.pathname === "/") {
		store.dispatch({type: `REQUEST_FETCH_QUESTIONS`});
	} 
	if (location.pathname.includes(`questions`)) {
		store.dispatch({type: `REQUEST_FETCH_QUESTION`, question_id: location.pathname.split('/')[2]});
	}
}

const render = (_App) => {
  ReactDOM.render(
    <Provider store={store}>
    	<ConnectedRouter history={history}>    		
    		<_App />
    	</ConnectedRouter>
    </Provider>,
    document.getElementById('AppContainer')
  );
};

store.subscribe(() => {
	const state = store.getState();
	if(state.questions.length > 0) {
		console.info("Mounting app");
		render(App);
	} else {
		console.info("App not yet mounting");
	}
});

fetchDataForLocation(history.location);
