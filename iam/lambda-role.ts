import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { bucket } from "../storage/s3";

export const lambdaRole = new aws.iam.Role("lambda-role", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "lambda.amazonaws.com" }),
});

new aws.iam.RolePolicyAttachment("lambda-basic-exec", {
  role: lambdaRole.name,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

new aws.iam.RolePolicy("s3-access", {
  role: lambdaRole.id,
  policy: pulumi.all([bucket.bucket]).apply(([bucketName]) => JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: ["s3:PutObject"],
      Resource: `arn:aws:s3:::${bucketName}/uploads/*`,
    }],
  })),
});