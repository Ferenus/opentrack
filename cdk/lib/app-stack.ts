import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';
import {Role} from "@aws-cdk/aws-iam";
import {Domain} from "@aws-cdk/aws-elasticsearch";

export interface AppStackProps extends cdk.StackProps {
    lambdaServiceRole: Role,
    esDomain: Domain
}

export class AppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: AppStackProps) {
        super(scope, id, props);

        const handler = new NodejsFunction(this, "ContainerHandler", {
            memorySize: 1024,
            timeout: cdk.Duration.seconds(5),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "main",
            entry: path.join(__dirname, `/../src/lambda/index.ts`),
            role: props.lambdaServiceRole,
            environment: {
                "DOMAIN": props.esDomain.domainEndpoint,
            }
        });

        const api = new apigateway.RestApi(this, "app-search-api", {
            restApiName: "Container Search Api",
            description: "This service allows you to search for containers.",
            defaultCorsPreflightOptions: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowCredentials: true,
                allowOrigins: ['http://localhost:3000', 'http://staticsitestack-sitebucket397a1860-13bk5941668jg.s3-website.us-east-2.amazonaws.com'],
            },
        });

        const getContainers = new apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' },
            requestParameters: {
                "integration.request.querystring.q": "method.request.querystring.q",
            }
        });

        api.root.addMethod("GET", getContainers, {
            requestParameters: {
                "method.request.querystring.q": true,
            }
        });
    }
}