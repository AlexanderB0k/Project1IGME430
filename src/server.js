const http = require('http');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./Response.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];
        if (type === 'application/x-www-form-urlencoded') {
            request.body = query.parse(bodyString);
        } else if (type === 'application/json') {
            request.body = JSON.parse(bodyString);
        } else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();
        }

        handler(request, response);
    });
};

const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/PostPokemons') {
        parseBody(request, response, responseHandler.postIDNameandType);
    } else if (parsedUrl.pathname === '/UpdatePokemon') {
        parseBody(request, response, responseHandler.postWeightandHeight);
    } else {
        responseHandler.notFound(request, response);
    }
};

const handleGet = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/') {
        return htmlHandler.getIndexResponse(request, response);
    }
    else if (parsedUrl.pathname === '/style.css') {
        return htmlHandler.getCSSResponse(request, response);
    }
    else if (parsedUrl.pathname === '/GetAllPoke') {
        return responseHandler.getAllPoke(request, response);
    }
    else if (parsedUrl.pathname === '/GetName') {
        return responseHandler.getPokebyName(request, response, parsedUrl);
    }
    else if (parsedUrl.pathname === '/GetPokemons') {
        return responseHandler.getPokeTypeandID(request, response, parsedUrl);
    }
    else if (parsedUrl.pathname === '/GetPokemonbyNameIDType') {
        return responseHandler.getPokeNameIDandType(request, response, parsedUrl);
    }
    else if (parsedUrl.pathname === '/notReal') {
        return responseHandler.notFound(request, response);
    }
    return responseHandler.notFound(request, response);
};

// function to handle requests
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    } else if (request.method === 'GET' || request.method === 'HEAD') {
        handleGet(request, response, parsedUrl);
    } else {
        responseHandler.notFound(request, response);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});
