const fs = require('fs').promises;
const path = require('path');
const {
    S3Client,
    PutObjectCommand
} = require('@aws-sdk/client-s3');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');

const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.ACCESS_SECRET,
    },
    requestHandler: new NodeHttpHandler({
        connectionTimeout: 60000,
        socketTimeout: 60000,
    }),
    maxRetries: 5,
});

const BUCKET_NAME = process.env.BUCKET_NAME;

async function push() {
    const repopath = path.resolve(process.cwd(), ".privgit");
    const commitpath = path.join(repopath, "commit");

    try {
        const commitdirs = await fs.readdir(commitpath);

        for (const commitdir of commitdirs) {
            const commitdirpath = path.join(commitpath, commitdir);
            const checkfile = await fs.stat(commitdirpath);

            if (checkfile.isDirectory()) {
                const files = await fs.readdir(commitdirpath);
                for (const file of files) {
                    const filepath = path.join(commitdirpath, file);
                    if (!file) {
                        console.error(`Skipping empty file in directory: ${commitdirpath}`);
                        continue;
                    }
                    const fileContent = await fs.readFile(filepath);
                    const relativePath = path.relative(commitpath, filepath);

                    console.log(`Uploading file: ${relativePath} to bucket: ${BUCKET_NAME}`);
                    await s3Client.send(new PutObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: relativePath.replace(/\\/g, '/'),
                        Body: fileContent,
                    }));
                }
            } else if (checkfile.isFile()) {
                const fileContent = await fs.readFile(commitdirpath);
                console.log(`Uploading file: ${commitdir} to bucket: ${BUCKET_NAME}`);

                await s3Client.send(new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: commitdir,
                    Body: fileContent,
                }));
            }
        }

        console.log("Push completed successfully to S3");
    } catch (error) {
        console.error("Error during push:", error.message, error.stack);
    }
}

module.exports = {
    push,
};
