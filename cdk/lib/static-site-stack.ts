import cloudfront = require("@aws-cdk/aws-cloudfront");
import s3 = require("@aws-cdk/aws-s3");
import s3deploy = require("@aws-cdk/aws-s3-deployment");
import cdk = require("@aws-cdk/core");
import { Stack, App, StackProps } from "@aws-cdk/core";

export interface StaticSiteProps extends StackProps {
    bucketName: string,
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class StaticSiteStack extends Stack {
    constructor(parent: cdk.Construct, name: string, props: StaticSiteProps) {
        super(parent, name, props);

        // Content bucket
        const siteBucket = new s3.Bucket(this, "SiteBucket", {
            bucketName: props.bucketName,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            publicReadAccess: true,

            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
            removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
        });
        new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(
            this,
            "SiteDistribution",
            {
                originConfigs: [
                    {
                        customOriginSource: {
                            domainName: siteBucket.bucketWebsiteDomainName,
                            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                        },
                        behaviors: [{ isDefaultBehavior: true }],
                    },
                ],
            }
        );
        new cdk.CfnOutput(this, "DistributionId", {
            value: distribution.distributionId,
        });

        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
            sources: [s3deploy.Source.asset("./site-contents")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"],
        });
    }
}