import fetch, { Request, Headers } from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function makeRequest(requestUrl) {
    try {
        const myRequest = new Request(requestUrl, { headers: parseHeaders() });
        const response = await fetch(myRequest);
        let document = new JSDOM(await response.text()).window.document;
        if (/(unusual traffic)|(tráfico inusual)/.test(document.body.textContent)) {
            console.log('EMPEZÓ A BLOQUEAR!!!');
            throw (new Error(`Blocked at ${myRequest.url} by google scholar for unusual traffic.`));
        }
        return Promise.resolve(document);
    } catch (error) {
        return Promise.reject(error);
    }
}

function parseHeaders() {
    // Directly copied from a real user request.
    // Without headers Google Scholar was blocking every request I tried to make.
    let requestHeaders = `:authority: scholar.google.com
                            :method: GET
                            :path: /citations?view_op=search_authors&mauthors=asdf&hl=en&oi=drw
                            :scheme: https
                            accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
                            accept-encoding: gzip, deflate, br
                            accept-language: en-US,en;q=0.5
                            cache-control: max-age=0
                            cookie: SEARCH_SAMESITE=CgQIw5UB; SID=Nghcl8L4OPucO51b8JPG69qv1_wWNCmCDnLY8Exs2Mh_5GYrlSdC_T-qZD1usQ8fQ8w9eQ.; __Secure-1PSID=Nghcl8L4OPucO51b8JPG69qv1_wWNCmCDnLY8Exs2Mh_5GYrY-1wAs0KcW6kkWNVy-Yf7w.; __Secure-3PSID=Nghcl8L4OPucO51b8JPG69qv1_wWNCmCDnLY8Exs2Mh_5GYrNQ7tOvfxhzAvxRa1ZEK47A.; HSID=A7-8saLr8zrdzjVQK; SSID=AseGnQz_ozCEJN41I; APISID=HEVJFYpNHB2Dwt8O/ARdUso13VyHMdGnT8; SAPISID=nutf8BVsorVrTE1R/A9fH5muGAIp2haJMP; __Secure-1PAPISID=nutf8BVsorVrTE1R/A9fH5muGAIp2haJMP; __Secure-3PAPISID=nutf8BVsorVrTE1R/A9fH5muGAIp2haJMP; AEC=AakniGNmEOwMiy-qLaIHvwN2JnRVWZRddXChtBE3KfC8xLKtv0O4qV_wFWI; 1P_JAR=2022-09-03-21; GSP=LM=1662266475:S=iXZu46GIDgnHQcAP; NID=511=qyawr7tffrr1ht70woH-05eZnN8sfLEEFpsee4SLLX8og3ZchZzv57SjFWQhYTGnNFDK5qaP7jUNUkGqE_io3l7wjez5EG0kZx88MnPEPLsB4Xi1t8NVJxw6OTGxV3x91-Zfys5FaaxhknSoVfdKuHckQ6SewHxgkccKHBRD-HSYJRuHYIiKNMRYY9AqBQcuDvTx1FGnFSUFDmlATc8g-FaXk23_GGkITgoqTJgxOc8_vdGGLG2Mfx6s2Lx2GpF-OPerZFgWdUgRUTrqrrGDaYag0z8MnNhTTIEjW9IFkK82aWaxEDBBQyUna_LawAtm2Ms4-BgLfmX8921tasU_gCTi7CHc2y_71MztbJdClL857Ym6ZwPDj3eCwWgqFeav3z3Bg5Khcb8vc2_e2p93rDc1mGEHRrJ-rKEFK0knfjzkskaBqZgSQOIBggq1Zb4rKwzzKlOYHWUfg7ObXCGInhfx9I7fIgrGdoG1Wx0jWj869U3nXXBKEM6FuTnf7dIB50_pvqj98UCdphB9NITxusUlPA1XbA; SIDCC=AEf-XMSvmsYBC9BquImLusQTNI6X2cMVc0dJF7-9uzSbeV3IUBsHjD_TPCr7jpS6Fi4375pV2EA; __Secure-1PSIDCC=AEf-XMScj1De1fHJkGvMs55jBxZXRLmaT-SQa7Pdzhpo04LPGWWziM3_w7zCCTlZ4fj2xOE02gqd; __Secure-3PSIDCC=AEf-XMRf1Oqd594mkbdtTBctob1OSNlC5mtnPWU3HtzQIA4NsqbVnYiq2bWexgTcGOFWtzJpLNRW
                            referer: https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=asdf&btnG=
                            sec-fetch-dest: document
                            sec-fetch-mode: navigate
                            sec-fetch-site: same-origin
                            sec-fetch-user: ?1
                            sec-gpc: 1
                            upgrade-insecure-requests: 1
                            user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36`;
    requestHeaders = requestHeaders.trim().split('\n');
    let myHeaders = new Headers();
    if (requestHeaders != '') {
        for (let header of requestHeaders) {
            header = header.trim();
            if (header[0] == ':') {
                header = header.replace(':', '');
            }
            header = header.split(': ');
            myHeaders.append(header[0], header[1]);
        }
    }

    return myHeaders;
}
