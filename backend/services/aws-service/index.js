// S3Service.js

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  ListBucketsCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

export class S3Service {
  constructor() {
    console.log({
      AWS_REGION: process.env.AWS_REGION,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY_ID: process.env.AWS_SECRET_ACCESS_KEY_ID,
    });
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
      },
    });
  }

  async createBucket() {
    const bucketName = `test-bucket-${Date.now()}`;
    await this.s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      })
    );
  }
  async listBuckets() {
    const bucketName = `test-bucket-${Date.now()}`;
    const command = new ListBucketsCommand({});
    await this.s3Client.send(command).then((res) => {
      console.log({ res });
    });
  }

  async existsFolder(Key) {
    const command = new HeadObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key });
    try {
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === "NotFound") {
        return false;
      } else {
        throw error;
      }
    }
  }

  async createFolder(Key) {
    const command = new PutObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key });
    this.s3Client
      .send(command)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
  async putFile({ file, type, filename }) {
    const command = new PutObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: filename, ContentType: type, Body: file });
    this.s3Client
      .send(command)
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async createFolderIfNotExist(Key) {
    if (!(await this.existsFolder(Key))) {
      return this.createFolder(Key);
    }
  }
  async deleteFolder(Key) {
    const command = new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key });
    this.s3Client
      .send(command)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}
