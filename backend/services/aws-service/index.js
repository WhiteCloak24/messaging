// S3Service.js
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  ListBucketsCommand,
  HeadObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export class S3Service {
  constructor() {
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
    return new Promise((resolve) => {
      const command = new PutObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: filename, ContentType: type, Body: file });
      this.s3Client
        .send(command)
        .then(() => {
          resolve(true);
          return true;
        })
        .catch((err) => {
          resolve(false);
          return false;
        });
    });
  }

  async deleteFile({ filename }) {
    return new Promise((resolve) => {
      const command = new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: filename });
      this.s3Client
        .send(command)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
        });
    });
  }
  async getResourceSignedUrl({ filename }) {
    return new Promise(async (resolve) => {
      try {
        const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: filename });
        const url = await getSignedUrl(this.s3Client, command);
        resolve(url);
      } catch (_) {
        resolve("");
      }
    });
  }

  async createFolderIfNotExist(Key) {
    if (!(await this.existsFolder(Key))) {
      return this.createFolder(Key);
    }
  }
  async deleteFolder({ Key }) {
    return new Promise(async (resolve) => {
      try {
        const listFilesCommand = new ListObjectsV2Command({ Bucket: process.env.AWS_BUCKET_NAME, Prefix: Key });
        const listResponse = await this.s3Client.send(listFilesCommand);
        const objectsToDelete = listResponse.Contents.map((object) => ({ Key: object.Key }));
        for (let index = 0; index < objectsToDelete.length; index++) {
          const object = objectsToDelete[index];
          const deleteCommand = new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: object.Key });
          await this.s3Client.send(deleteCommand);
        }
        resolve(true);
      } catch (e) {
        resolve(false);
      }
    });
  }
}
