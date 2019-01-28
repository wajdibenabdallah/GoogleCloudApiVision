async function bigQuery(){
    // Imports the Google Cloud client library
const {BigQuery} = require('@google-cloud/bigquery');

// Creates a client
const bigquery = new BigQuery();

const query = `SELECT name
  FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
  WHERE state = 'TX'
  LIMIT 100`;
const options = {
  query: query,
  // Location must match that of the dataset(s) referenced in the query.
  location: 'US',
};

// Runs the query as a job
const [job] = await bigquery.createQueryJob(options);
console.log(`Job ${job.id} started.`);

// Waits for the query to finish
const [rows] = await job.getQueryResults();

// Prints the results
console.log('Rows:');
rows.forEach(row => console.log(row));
}

bigQuery();