import s3 = require("@aws-cdk/aws-s3");
import s3deploy = require("@aws-cdk/aws-s3-deployment");
import cdk = require("@aws-cdk/core");
import { Stack, StackProps } from "@aws-cdk/core";

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 */
export class StaticSiteStack extends Stack {
    constructor(parent: cdk.Construct, name: string, props: StackProps) {
        super(parent, name, props);

        // Content bucket
        const siteBucket = new s3.Bucket(this, "SiteBucket", {
            websiteIndexDocument: "index.html",
            publicReadAccess: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this, "DeployStaticWebsite", {
            sources: [s3deploy.Source.asset("../static-website/build")],
            destinationBucket: siteBucket,
        });
    }
}