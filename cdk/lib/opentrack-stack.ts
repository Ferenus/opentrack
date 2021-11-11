import * as cdk from '@aws-cdk/core';
import {VpcStack} from "./vpc-stack";
import {CredentialsStack} from "./credentials-stack";
import {RdsStack} from "./rds-stack";
import {StaticSiteStack} from "./static-site-stack";
import {AppStack} from "./app-stack";

export class OpentrackStack extends cdk.Stack {
    constructor(app: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(app, id, props);

        const vpcStack = new VpcStack(app, "VpcStack");
        const vpc = vpcStack.vpc;

        const credentialsStack = new CredentialsStack(
            app,
            "CredentialsStack"
        );

        const rdsStack = new RdsStack(app, "RdsStack", {
            credentials: credentialsStack.credentials,
            vpc,
        });

        const dbInstance = rdsStack.postgreSQLinstance;

        const staticSite = new StaticSiteStack(app, "StaticSiteStack", {});

        const backend = new AppStack(app, "AppStack", {});
    }
}
