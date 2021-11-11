import * as cdk from "@aws-cdk/core";
import { ISecret, Secret } from "@aws-cdk/aws-secretsmanager";

export interface Credentials {
    username: ISecret;
    password: ISecret;
}

export class CredentialsStack extends cdk.Stack {
    readonly credentials: { username: ISecret; password: ISecret };

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const secretUsername = Secret.fromSecretCompleteArn(
            this,
            "PostgresUsername",
            "arn:aws:secretsmanager:us-east-2:563186744327:secret:prod/Opentrack/Postgres/user-9XEuBo"
        );

        const secretPassword = Secret.fromSecretCompleteArn(
            this,
            "PostgresPassword",
            "arn:aws:secretsmanager:us-east-2:563186744327:secret:prod/Opentrack/Postgres/password-GJH9DD"
        );

        this.credentials = {
            username: secretUsername,
            password: secretPassword,
        };
    }
}