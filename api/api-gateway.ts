import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { lambdaFunc } from "../lambda-archive/lambda";

export const api = new aws.apigatewayv2.Api("upload-api", {
  protocolType: "HTTP",
});

const lambdaIntegration = new aws.apigatewayv2.Integration("lambda-integration", {
  apiId: api.id,
  integrationType: "AWS_PROXY",
  integrationUri: lambdaFunc.invokeArn,
  integrationMethod: "POST",
  payloadFormatVersion: "2.0",
});

const route = new aws.apigatewayv2.Route("route", {
  apiId: api.id,
  routeKey: "GET /generate-presigned-url",
  target: pulumi.interpolate`integrations/${lambdaIntegration.id}`,
});

const stage = new aws.apigatewayv2.Stage("dev-stage", {
  apiId: api.id,
  name: "dev",
  autoDeploy: true,
});

// Lambda Permission to Allow API Gateway
new aws.lambda.Permission("api-permission", {
  action: "lambda:InvokeFunction",
  function: lambdaFunc.name,
  principal: "apigateway.amazonaws.com",
  sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
});