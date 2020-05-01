import * as riot from 'riot';
import App from './tags/app.riot';

const fetchAPI = async endPoint => {
    return await (await fetch(`/api/${endPoint}`)).json();
}

(async() => {
    console.log(App);
    const DBData = await fetchAPI('db');
    riot.register('app', App);
    riot.mount('app', { DBData })
})();