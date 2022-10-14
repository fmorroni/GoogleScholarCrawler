import makeRequest from './makeRequest.js';
import {randDelay} from './delay.js'
import {domain, language} from './globals.js'

export default async function getIDsFromInstitution(institutionURL) {

    let document = await makeRequest(institutionURL);
    console.log(document);
    let IDs = [];
    let buttons = document.querySelectorAll('button[type="button"]')
    let button = buttons[buttons.length-1];
    let lastPage = false;

    while(!lastPage) {
        
        await randDelay(3,5);
        
        let usersInPage = document.querySelectorAll('h3 > a[href*="user"]');
        
        usersInPage.forEach(user => {
            let userID = user.href.match("user=([^&]*)")[1];
            console.log(userID);
            IDs.push(userID);
        });
        
        if(!button.disabled) {    
            // siguiente pagina
            document = await makeRequest(getNextURL(button));
            // actualizo el boton
            buttons = document.querySelectorAll('button[type="button"]')
            button = buttons[buttons.length-1];
            console.log("Next page.")
        }
        else {
            lastPage = true;
        }
    }

    console.log("Cantidad de IDs encontrados: ", IDs.length);
    return IDs;
}

function getNextURL(button) {
    let afterAuthor = button.outerHTML.match(/after_author\\x3d(.*?)\\/)[1];
    let astart = button.outerHTML.match(/astart\\x3d(.*?)'/)[1];
    console.log(astart);
    let nextURL = `${domain}/citations?view_op=view_org&hl=${language}&org=16159832269951878529&after_author=${afterAuthor}&astart=${astart}`;
    return nextURL;
}
