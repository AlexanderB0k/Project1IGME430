const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const bulma = fs.readFileSync(`${__dirname}/../node_modules/bulma/css/bulma.min.css`);
const documentAPI = fs.readFileSync(`${__dirname}/../client/DocumentAPI.html`);

const getIndexResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
}

const getCSSResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
}

const getBulmaResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(bulma);
  response.end();
};

const getDocumentAPIResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(documentAPI);
  response.end();
}

module.exports = {
  getIndexResponse,
  getDocumentAPIResponse,
  getCSSResponse,
  getBulmaResponse
};