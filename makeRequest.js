import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function makeRequest(myRequest) {
    try {
        const response = await fetch(myRequest);
        let document = new JSDOM(await response.text()).window.document;
        
        return document;
    } catch (error) {
        console.log('Error in makeRequest', error);
    }
}
