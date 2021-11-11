import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';

export class AppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //const bucket = new s3.Bucket(this, "WidgetStore");

        const handler = new NodejsFunction(this, "ContainerHandler", {
            memorySize: 1024,
            timeout: cdk.Duration.seconds(5),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "main",
            entry: path.join(__dirname, `/../src/lambda/index.ts`),
            // environment: {
            //     BUCKET: bucket.bucketName
            // }
        });

        //bucket.grantReadWrite(handler);

        const api = new apigateway.RestApi(this, "app-api", {
            restApiName: "Opentrack App",
            description: "This service allows you to search for containers."
        });

        const getContainers = new apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });

        api.root.addMethod("GET", getContainers);
    }
}