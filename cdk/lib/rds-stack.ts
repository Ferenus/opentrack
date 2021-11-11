import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as rds from "@aws-cdk/aws-rds";
import { Credentials } from "./credentials-stack";

export interface RdsStackProps extends cdk.StackProps {
    credentials: Credentials;
    vpc: ec2.Vpc;
}

export class RdsStack extends cdk.Stack {
    readonly postgreSQLinstance: rds.DatabaseInstance;

    constructor(scope: cdk.Construct, id: string, props: RdsStackProps) {
        super(scope, id, props);

        const username = props.credentials.username.secretValue.toString();
        const password = props.credentials.password.secretValue;

        this.postgreSQLinstance = new rds.DatabaseInstance(this, "Postgres", {
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_12_4,
            }),
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO
            ),
            vpc: props.vpc,
            vpcPlacement: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            storageType: rds.StorageType.GP2,
            deletionProtection: false,
            databaseName: username,
            port: 5432,
            credentials: {
                username,
                password,
            },
        });

        this.postgreSQLinstance.connections.allowDefaultPortFromAnyIpv4();
        this.postgreSQLinstance.connections.allowDefaultPortInternally();
    }
}