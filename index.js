'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});
const Sharp = require('sharp');

const imageSizes = [
    { width: 90, height: 68, modifier: '-s' },
    { width: 345, height: 260, modifier: '-m' },
    { width: 1024, height: 768, modifier: '' },
];

exports.handler = (event, context) => {
    event.Records.map(async (record) => {
        let objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

        await S3.getObject({
            Bucket: record.s3.bucket.name, 
            Key: objectKey
        }).promise()
            .then(data => {
                let imagePromises = [];

                imageSizes.forEach(sizeData => {
                    imagePromises.push(
                        Sharp(data.Body)
                            .resize(sizeData.width, sizeData.height)
                            .withoutEnlargement()
                            .background({ r: 255, g: 255, b: 255, alpha: 1 })
                            .embed()
                            .png({ force: false })
                            .jpeg({ force: false })
                            .toBuffer()
                            .then(buffer => {
                                let newKey = objectKey.substring(0, objectKey.lastIndexOf('.')) + 
                                    sizeData.modifier + 
                                    objectKey.substring(objectKey.lastIndexOf('.'));

                                return S3.putObject({
                                    Body: buffer,
                                    Bucket: record.s3.bucket.name.replace('-original', ''),
                                    ContentType: data.ContentType,
                                    Key: newKey,
                                }).promise()
                            })
                    );
                });

                return Promise.all(imagePromises);
            })
            .catch(err => {
                context.fail(err);
            });
    });
};
