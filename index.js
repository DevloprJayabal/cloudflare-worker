
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Functionality used to get one  individual key value data as a pair
 * or it will give the deault as a value of all keys available in the KV database
 * to the cloudflare KV db
 * @param {*} request 
 * @returns {*} Reponse
 */
const getOneOrAllKeyValues = async (request) => {
	const url = new URL(request.url);
	const id = url.pathname;
  console.info(`id ==> ${id}`);
  let finalResult;
  if(id !== "" && id != undefined && id != "/") {
    const modifiedKey = id.substring(1);
    console.info(`modifiedKey, ${modifiedKey}`);
    finalResult = await demo_kv.get(modifiedKey);
  } else {
    finalResult = await demo_kv.list();
    finalResult = finalResult.values;
    console.info(JSON.stringify(finalResult, null ,2))
  }	 
  return (finalResult === null) ? new Response("Value not found", { status: 404 }) : new Response(JSON.stringify(finalResult, null, 2), { status: 200 });
}

/**
 * Functionality used to add or update the individual key value data
 * to the cloudflare KV db
 * @param {*} request 
 * @returns {*} Reponse
 */
const addOrUpdateIndividualKeyValue = async (request) => {
  const { key, value } = await request.json();
	await demo_kv.put(key, value);  
  return new Response(`Successfully added/updated the ${key} to db`, { status: 201 });
}

/**
 * Functionality used to delete the individual key value data
 * to the cloudflare KV db
 * @param {*} request 
 * @returns {*} Reponse
 */
const deleteIndividualKeyValue = async (request) => {
  const { key } = await request.json();
	await demo_kv.delete(key);  
  return new Response(`Success deleted the key from db ${key}`, { status: 200 });
}

async function handleRequest(request) {

  let finalResponse;
  const methodValue = request.method.toLowerCase();

  switch (methodValue) {
    case 'get':
      finalResponse = await getOneOrAllKeyValues(request);
      break;
    case 'put':
      finalResponse = await addOrUpdateIndividualKeyValue(request);
      break;
    case 'delete':
      finalResponse = await deleteIndividualKeyValue(request);
      break;
  }
  return finalResponse;
}