import makeRequest from './makeRequest.js';
import {randDelay} from './delay.js'
import {domain, language} from './globals.js'

export default async function getIDsFromInstitution(institutionURL) {

    let document = await makeRequest(institutionURL);
    console.log(document);
    let IDs = [];
    let buttons = document.querySelectorAll('button[type="button"]')
    console.log(buttons);
    let button = buttons[buttons.length-1];

    /*while(!button.disabled) {
        
        randDelay(10,20);
        document = await makeRequest(getNextURL(button));

        let usersInPage = document.querySelectorAll('h3 > a[href*="user"]');
        
        usersInPage.forEach(user => {
            IDs.push(user.href.match("user=([^&]*)")[1]);
        });

        // actualizo el boton
        button = document.querySelectorAll('button[type="button"]')[4]
    }
    */

}

function getNextURL(button) {
    let afterAuthor = button.outerHTML.match(/after_author\\x3d(.*?)\\/);
    let astart = button.outerHTML.match(/astart\\x3d(.*?)'/);
    let nextURL = `${domain}/citations?view_op=view_org&hl=${language}&org=16159832269951878529&after_author=${afterAuthor}&astart=${astart}`;
    return nextURL;
}
