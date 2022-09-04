import fetch, {Request} from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function makeRequest(requestUrl) {
    try {
        const myRequest = new Request(requestUrl);
        const response = await fetch(myRequest);
        let document = new JSDOM(await response.text()).window.document;
        if (/(unusual traffic)|(tráfico inusual)/.test(document.body.textContent)) {
            console.log('EMPEZÓ A BLOQUEAR!!!');
            throw(new Error(`Blocked at ${myRequest.url} by google scholar for unusual traffic.`));
        }
        return Promise.resolve(document);
    } catch (error) {
        return Promise.reject(error);
    }
}
