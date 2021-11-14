# Problem statement
You should expose the ability to perform the following full-text search queries, that returns containers by:
- container ID
- port name
- terminal name
- terminal FIRMS code
- vessel name
- vessel IMO

Your solution should scale well to large (> 1 million record) table sizes

# Opentrack project
Website: http://staticsitestack-sitebucket397a1860-13bk5941668jg.s3-website.us-east-2.amazonaws.com/

# CDK
Deployment region: us-east-2

cdk synth
cdk deploy --all

# Website
Development mode:
`yarn start`

Production build:
`yarn build`

# Loading data to ES
IAM Role to access ES:

`Role ARN: arn:aws:iam::563186744327:role/OpentrackStack-lambdaServiceRole73D6B375-RT7EFJ0K7SL8`

INSERT INTO ES:

curl -XPOST -u "user:password" "https://search-esstack-domain-1pyplst33e0dn-wp563x6rajepmm5rr4ti5xuby4.us-east-2.es.amazonaws.com/_bulk" --data-binary @bulk_containers.json -H "Content-Type: application/json"