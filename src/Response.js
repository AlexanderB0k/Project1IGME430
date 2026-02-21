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

const getPokebyName = (request, response, parsedUrl) => {

  const responseData = {
    message: 'Name query parameter is required',
    id: 'missingParams'
  }

  const missingresponseData = {
    message: 'Pokemon not found',
    id: 'notFound'
  }

  if (!parsedUrl.searchParams.get('name')) {
    return respondJson(request, response, 400, responseData);
  }

  const filteredPokemon = pokemonData.filter((poke) =>
    poke.name.toLowerCase() ===
    parsedUrl.searchParams.get('name').toLowerCase()
  );

  if (filteredPokemon.length === 0) {
    return respondJson(request, response, 404, missingresponseData);
  }

  return respondJson(request, response, 200, {
    pokemon: filteredPokemon
  });
};

const getPokeNameIDandType = (request, response, parsedUrl) => {

  const messageNotFound = {
    message: 'Pokemon not found',
    id: 'notFound',
  }

  const name = parsedUrl.searchParams.get('name');
  const id = parsedUrl.searchParams.get('id');
  const type = parsedUrl.searchParams.get('type');

  let filteredPokemon = pokemonData;

  if (name) {
    filteredPokemon = filteredPokemon.filter((poke) =>
      poke.name.toLowerCase() === name.toLowerCase()
    );
  }

  if (id) {
    filteredPokemon = filteredPokemon.filter((poke) =>
      String(poke.id) === String(id)
    );
  }

  if (type) {
    filteredPokemon = filteredPokemon.filter((poke) =>
      poke.type.some((t) => t.toLowerCase() === type.toLowerCase())
    );
  }

  if (filteredPokemon.length === 0) {
    return respondJson(request, response, 404, messageNotFound);
  }

  return respondJson(request, response, 200, {
    pokemon: filteredPokemon,
  });
};
const getPokeTypeandID = (request, response, parsedUrl) => {
  const responseData = {
    message: "The pokemon type and id isn't here",
    id: "missingParams"
  }

  let filteredPokemon = pokemonData;

  const type = parsedUrl.searchParams.get('type');
  const id = parsedUrl.searchParams.get('id');

  if (type) {
    filteredPokemon = filteredPokemon.filter((poke) => poke.type.some((t) => t.toLowerCase() === type.toLowerCase()));
  }

  if (id) {
    filteredPokemon = filteredPokemon.filter((poke) => String(poke.id) = String(id));
  }

  if (!filteredPokemon) {
    return respondJson(request, response, 404, messageNotFound);
  }

  return respondJson(request, response, 200, { pokemon: filteredPokemon });

}

const postIDNameandWeakness = (request, response, parsedURL) => {
  const responseJson = {
    message: 'Invalid or empty ID, name, and Weakness'
  }

  const responseAlreadyexists = {
    message: 'The data for the name already exists'
  }
  const id = parsedURL.searchParams.get('id');
  const name = parsedURL.searchParams.get('name');
  const weakness = parsedURL.searchParams.get('weakness');

  const pokemon = pokemonData;

  //Checks there is a an id, type and weakness
  if (!id || !name || !weakness) {
    return responseJson(request, response, 400, responseJson);
  }

  //check if the names or id exist in the json or not
  if (pokemon.filter((poke) => poke.name.toLowerCase() === name.toLowerCase()) ||
    pokemon.filter((poke) => String(poke.id) = String(id))) {
    return respondJson(request, response, 400, responseAlreadyexists);
  }

  const newUser = {
    id: {

    },
    name: {

    },
    weakness: {
      []
    }
  }
  respondJson(request, response, 204, pokemon);

}
/*




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
  getPokebyName,
  getPokeNameIDandType,
  getPokeTypeandID,
  /*
  postIDTypeandWeakness,
  postWeightandHeight,
  */
  notImplemented,
  notFound,
};