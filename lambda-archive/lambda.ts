import * as esbuild from "esbuild";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { lambdaRole } from "../iam/lambda-role";
import { bucket } from "../storage/s3";

esbuild.buildSync({
  entryPoints: ["lambda/presign.ts"],
  outfile: "lambda/presign.js",
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
});

const lambdaZip = new pulumi.asset.AssetArchive({
  ".": new pulumi.asset.FileArchive("./lambda"),
});

// Lambda Function
export const lambdaFunc = new aws.lambda.Function("presignLambda", {
  runtime: "nodejs18.x",
  code: lambdaZip,
  handler: "presign.handler",
  role: lambdaRole.arn,
  environment: {
    variables: {
      BUCKET_NAME: bucket.bucket,
    },
  },
});