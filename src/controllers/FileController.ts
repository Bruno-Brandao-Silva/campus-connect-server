// import { Request, Response } from 'express';
// import { ConnectToDb, FileExists } from '../models/Bucket';
// const FileController = {
//     upload: async (req: Request, res: Response) => {
//         const { bucket, client } = await ConnectToDb();
//         const data = await req.formData();

//         for (const entry of Array.from(data.entries())) {
//             const [key, value] = entry;
//             const isFile = typeof value == "object";

//             if (isFile) {
//                 const blob = value as Blob;
//                 const filename = blob.name;

//                 const existing = await FileExists({ client, filename });
//                 if (existing) {
//                     continue;
//                 }

//                 const buffer = Buffer.from(await blob.arrayBuffer());
//                 const stream = Readable.from(buffer);

//                 const uploadStream = bucket.openUploadStream(filename, {
//                     contentType: blob.type,
//                     metadata: {}, //add your metadata here if any
//                 });

//                 await stream.pipe(uploadStream);
//             }
//         }
//     }
// };

// export default FileController;

import { Request, Response } from 'express';
import multer from 'multer';
import { ConnectToDb, FileExists } from '../models/Bucket';
import { Readable } from 'stream';

const storage = multer.memoryStorage(); // Armazena os arquivos na memória como buffers
const upload = multer({ storage: storage });

const FileController = {
    upload: upload.array('files'), // 'files' é o nome do campo de formulário que contém os arquivos
    handleUpload: async (req: Request, res: Response) => {
        const { bucket, client } = await ConnectToDb();
        const files = req.files as Express.Multer.File[];

        for (const file of files) {
            const { originalname, buffer, mimetype } = file;

            const existing = await FileExists({ client, filename: originalname });
            if (existing) {
                continue;
            }

            const stream = Readable.from(buffer);

            const uploadStream = bucket.openUploadStream(originalname, {
                contentType: mimetype,
                metadata: {}, // adicione seus metadados aqui, se necessário
            });

            await stream.pipe(uploadStream);
        }

        res.send('Arquivos enviados com sucesso!');
    },
};

export default FileController;
