import * as cdk from "@aws-cdk/core";
import * as es from '@aws-cdk/aws-elasticsearch';
import {Role} from "@aws-cdk/aws-iam";
import {Domain} from "@aws-cdk/aws-elasticsearch";

export interface EsStackProps extends cdk.StackProps {
    domainName: string,
    lambdaServiceRole: Role,
}

export class EsStack extends cdk.Stack {
    readonly esDomain: Domain;

    constructor(scope: cdk.Construct, id: string, props: EsStackProps) {
        super(scope, id, props);

        this.esDomain = new es.Domain(this, 'Domain', {
            version: es.ElasticsearchVersion.V7_10,
            enableVersionUpgrade: true,
            capacity: {
                dataNodes: 1,
                dataNodeInstanceType: "t3.small.elasticsearch",
            },
            ebs: {
                volumeSize: 10
            },
            logging: {
                appLogEnabled: false,
                slowSearchLogEnabled: false,
                slowIndexLogEnabled: false,
            },
            nodeToNodeEncryption: true,
            encryptionAtRest: {
                enabled: true
            },
            enforceHttps: true,
            fineGrainedAccessControl: {
                masterUserArn: props.lambdaServiceRole.roleArn
            }
        });
    }
}