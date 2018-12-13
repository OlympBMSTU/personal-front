class API {

    constructor() {
        this.host = "https://olymp.bmstu.ru/api/personal";
    }

    requestData(method, httpMethod, params) {
                console.log('ReqMeth:'+httpMethod);
        const url = this.host + '/' + method;
        const httpRequest = {
                        credentials: 'include',
            method: httpMethod,
                        headers: {
                                'Content-type': 'application/json',
                                'Access-Control-Request-Method': httpMethod
                        },
                        mode: 'cors',
                        body: null
        };

        if(httpMethod === 'POST' && typeof params !== 'undefined') {
                        httpRequest.body = JSON.stringify(params);
        }

        return fetch(url, httpRequest).then(
                        function(response) {
                                response = response.json();
                                return response;
                        },
                        function(response) {
                                document.getElementById("error").innerHTML = 'Не удалось установить соединение: ' + response;
                                return response;
                        }
                );
    }

}

const api = new API();
