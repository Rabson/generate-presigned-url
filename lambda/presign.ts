import { S3 } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as uuid from "uuid";

const s3 = new S3();
const BUCKET_NAME = process.env.BUCKET_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  const { filename, filetype } = event.queryStringParameters || {};
  if (!filename || !filetype) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing filename or filetype" }),
    };
  }

  const key = `uploads/${uuid.v4()}_${filename}`;
  const url = s3.getSignedUrl("putObject", {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: filetype,
    Expires: 3600,
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ upload_url: url, file_key: key }),
  };
};
