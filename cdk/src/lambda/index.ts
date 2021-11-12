import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';

const AWS = require('aws-sdk');

export async function main(
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
    console.log('event: ', event);
    const query = event.queryStringParameters.q;

    let client = require('elasticsearch').Client({
        host: 'https://search-esstack-domain-1pyplst33e0dn-wp563x6rajepmm5rr4ti5xuby4.us-east-2.es.amazonaws.com',
        connectionClass: require('http-aws-es'),
        amazonES: {
            region: 'us-east-2',
            credentials: new AWS.Credentials('EsUser', 'testPassword123!') //TODO: Move to Secret Manager
        }
    });

    const response = await client.search({
        index: 'containers',
        type: '_doc',
        body: {
            query: {
                multi_match : {
                    query,
                    fields: ["container_id", "port_name", "terminal_name", "vessel_name", "firms_code"]
                }
            }
        }
    });

    console.log('response: ', response);

    return {
        body: JSON.stringify(response.hits.hits),
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
            "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE"
        },
        isBase64Encoded: false
    };
}