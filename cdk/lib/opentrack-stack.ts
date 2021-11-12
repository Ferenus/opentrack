import * as cdk from '@aws-cdk/core';
import {VpcStack} from "./vpc-stack";
import {CredentialsStack} from "./credentials-stack";
import {RdsStack} from "./rds-stack";
import {StaticSiteStack} from "./static-site-stack";
import {AppStack} from "./app-stack";
import {EsStack} from "./es-stack";
import {ManagedPolicy, Role, ServicePrincipal} from "@aws-cdk/aws-iam";

export class OpentrackStack extends cdk.Stack {
    constructor(app: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(app, id, props);

        const vpcStack = new VpcStack(app, "VpcStack");
        const vpc = vpcStack.vpc;

        const rdsCredentialsStack = new CredentialsStack(
            app,
            "CredentialsStack"
        );

        // RDS Postgres instance
        new RdsStack(app, "RdsStack", {
            credentials: rdsCredentialsStack.credentials,
            vpc,
        });

        const lambdaServiceRole = this.createServiceRole("lambdaServiceRole", 'lambda.amazonaws.com', "service-role/AWSLambdaBasicExecutionRole");

        // ElasticSearch
        const es = new EsStack(app, "EsStack", {domainName: "containers", lambdaServiceRole: lambdaServiceRole});

        // React static website
        new StaticSiteStack(app, "StaticSiteStack", {});

        // Lambda and API gateway
        new AppStack(app, "AppStack", {lambdaServiceRole: lambdaServiceRole, esDomain: es.esDomain});
    }

    private createServiceRole(identifier: string, servicePrincipal: string, policyName: string) {
        return new Role(this, identifier, {
            assumedBy: new ServicePrincipal(servicePrincipal),
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName(policyName)]
        });
    }

}
