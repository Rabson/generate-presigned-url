import * as pulumi from "@pulumi/pulumi";
import { api } from "../api/api-gateway";
import { bucket } from "../storage/s3";

export const bucketName = bucket.bucket;
export const apiUrl = pulumi.interpolate`${api.apiEndpoint}/dev/generate-presigned-url`;
