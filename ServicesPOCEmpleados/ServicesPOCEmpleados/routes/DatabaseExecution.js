const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');


const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });


const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/Country"] };

async function createDatabase() {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    console.log(`Created database:\n${database.id}\n`);
}

function exit(message) {
    console.log(message); 
}

async function createContainer() {

    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });
    console.log(`Created container:\n${config.container.id}\n`);
}

//async function createFamilyItem(itemBody) {
//    const { item } = await client.database(databaseId).container(containerId).items.upsert(itemBody);
//    console.log(`Created family item with id:\n${itemBody.id}\n`);

//}


//async function queryContainer() {
//    console.log(`Querying container:\n${config.container.id}`);

//    // query to return all children in a family
//    const querySpec = {
//        query: "SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName",
//        parameters: [
//            {
//                name: "@lastName",
//                value: "Andersen"
//            }
//        ]
//    };

//    const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
//    for (var queryResult of results) {
//        let resultString = JSON.stringify(queryResult);
//        console.log(`\tQuery returned ${resultString}\n`);
//    }
//}

//async function replaceFamilyItem(itemBody) {
//    console.log(`Replacing item:\n${itemBody.id}\n`);
//    // Change property 'grade'
//    itemBody.children[0].grade = 6;
//    const { item } = await client.database(databaseId).container(containerId).item(itemBody.id, itemBody.Country).replace(itemBody);
//}


//async function deleteFamilyItem(itemBody) {
//    await client.database(databaseId).container(containerId).item(itemBody.id, itemBody.Country).delete(itemBody);
//    console.log(`Deleted item:\n${itemBody.id}\n`);
//};


//async function cleanup() {
//    await client.database(databaseId).delete();
//}

createDatabase()   
    .then(() => createContainer()) 
    .then(() => { exit(`Completed successfully`); })
    .catch((error) => { exit(`Completed with error \${JSON.stringify(error)}`); });