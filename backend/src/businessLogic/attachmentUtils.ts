import * as AWS from 'aws-sdk'
// import * as AWSXRAY from 'aws-xray-sdk'
const AWSXRAY = require('aws-xray-sdk')
const XAWS = AWSXRAY.captureAWS(AWS)

export class AttachmentUtils {

    constructor(
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
        ) { }

    async getUploadUrl(attachmentId: string): Promise<string> {
        const parms = {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: this.urlExpiration
        }
        return this.s3.getSignedUrl('putObject', parms)
    } 

}