const pokemonIndex = require('./pokedex.json');

const pokemonData = pokemonIndex.pokemon || pokemonIndex;

const respondJson = (request, response, status, object) => {
  const content = JSON.stringify(object);

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content),
  };

  response.writeHead(status, headers);

  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

const notImplemented = (request, response) => {
  respondJson(request, response, 501, {
    message: 'Not Implemented',
    id: 'notImplemented',
  });
};

const getAllPoke = (request, response) => {
  respondJson(request, response, 200, { pokemon: pokemonData });
};
/*
const getPokeNameIDandType = (request, response) => {

}

const getPokebyName = (request, response) => {
    
}

const getPokeTypeandID = (request, response) => {
    
}

const postIDTypeandWeakness = (request, response) => {
    
}

const postWeightandHeight = (request, response) => {
    
}
*/

const notFound = (request, response) => {
  respondJson(request, response, 404, {
    message: 'This page you are looking for was not found',
    id: 'notFound',
  });
};

module.exports = {
  respondJson,
  getAllPoke,
  /*
  getPokeNameIDandType,
  getPokebyName,
  getPokeTypeandID,
  postIDTypeandWeakness,
  postWeightandHeight,
  */
  notImplemented,
  notFound,
};