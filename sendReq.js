async function sendReq(url = '', method = 'POST', contentType = 'application/json', data = {}){
    const response = await fetch(url, {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': contentType
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        // body: JSON.stringify(data)
    });
    return response.text();
}

export default sendReq;