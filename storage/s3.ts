import * as aws from "@pulumi/aws";

export const bucket = new aws.s3.Bucket("upload-bucket", {
  corsRules: [{
    allowedHeaders: ["*"],
    allowedMethods: ["PUT", "GET"],
    allowedOrigins: ["*"],
    maxAgeSeconds: 3000,
  }],
});