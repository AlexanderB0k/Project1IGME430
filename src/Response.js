const pokemonIndex = require('./pokedex.json');

const pokemonData = pokemonIndex.pokemon || pokemonIndex;

// Helper function to send JSON responses
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

//Get All Pokemon just returns the pokemon data from the json file
const getAllPoke = (request, response) => {
  respondJson(request, response, 200, { pokemon: pokemonData });
};

//All of the structure is the same as your code exercises but I just added the functionality to filter the pokemon data based on the query parameters that the client sends in.
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

//This function is similar to the getPokebyName function but it filters the pokemon data based on the type and id query parameters that the client sends in. 
//Used filter for the name id and the type 
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

//This function is similar to the getPokeNameIDandType function but it filters the pokemon data based on the type and id query parameters that the client sends in.
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
    filteredPokemon = filteredPokemon.filter((poke) =>
      String(poke.id) === String(id)
    );
  }

  // If no query parameters were provided, return a 404 error
  if (!filteredPokemon || filteredPokemon.length === 0) {
    return respondJson(request, response, 404, messageNotFound);
  }

  return respondJson(request, response, 200, { pokemon: filteredPokemon });

}

//Post for the ID name and type of the pokemon and then the other post is for the weight and height of the pokemon. 
const postIDNameandType = (request, response) => {
  const responseJson = {
    message: 'Invalid or empty ID, name, and type'
  }

  const responseAlreadyexists = {
    message: 'The data for the name already exists'
  }
  const { id, name, type } = request.body

  const idExists = pokemonData.some((p) => String(p.id) === String(id));
  const nameExists = pokemonData.some((p) => p.name.toLowerCase() === name.toLowerCase());

  const pokemon = pokemonData;

  //Checks there is a an id, type and weakness
  if (!id || !name || !type) {
    return respondJson(request, response, 400, responseJson);
  }

  //check if the names or id exist in the json or not
  if (idExists || nameExists) {
    return respondJson(request, response, 400, responseAlreadyexists);
  }

  const newPokemon = {
    id: id,
    name: name,
    type: [type],
  }

  pokemonData.push(newPokemon);

  respondJson(request, response, 201, { pokemon: newPokemon });

}

//Update the weight and height of a pokemon based on their name 
const postWeightandHeight = (request, response) => {
  const responseJson = {
    message: 'Invalid name'
  }

  const responseAlreadyexists = {
    message: 'The name that you trying to edit does not exist'
  }

  const { name, weight, height } = request.body;

  const pokemon = pokemonData;

  if (!name) {
    return respondJson(request, response, 400, responseJson);
  }

  const nameExists = pokemonData.filter(
    (p) => p.name.toLowerCase() === String(name).toLowerCase()
  );

  if (!nameExists || nameExists.length === 0) {
    return respondJson(request, response, 400, responseAlreadyexists);
  }

  const pokemonToUpdate = nameExists[0];

  //updates the weight
  if (weight) {
    pokemonToUpdate.weight = weight;
  }

  //updates the height
  if (height) {
    pokemonToUpdate.height = height;
  }

  return respondJson(request, response, 204, { pokemon: pokemonData });
}

//Check if the endpoint is not found 
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
  postWeightandHeight,
  getPokeTypeandID,
  postIDNameandType,
  notImplemented,
  notFound,
};