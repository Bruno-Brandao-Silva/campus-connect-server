import { Request, Response } from 'express';
import { ConnectToDb, FileExistsById, FileExistsByName } from '../models/Bucket';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';


const FileController = {
    handleUpload: async (req: Request, res: Response) => {
        const { bucket, client } = await ConnectToDb();
        const files = req.files as Express.Multer.File[];

        for (const file of files) {
            const { originalname, buffer, mimetype } = file;

            const existing = await FileExistsByName({ client, filename: originalname });
            if (existing) {
                continue;
            }

            const stream = Readable.from(buffer);

            const uploadStream = bucket.openUploadStream(originalname, {
                contentType: mimetype,
                // metadata: {}, // adicione seus metadados aqui, se necessário
            });
            stream.pipe(uploadStream);
        }

        res.send('Arquivos enviados com sucesso!');
    },
    downloadByName: async (req: Request, res: Response) => {
        const filename = req.params.filename;
        const { bucket, client } = await ConnectToDb();
        const existing = await FileExistsByName({ client, filename });
        if (!existing) {
            return res.status(404).end();
        }

        const downloadStream = bucket.openDownloadStreamByName(filename);
        downloadStream.pipe(res);
    },
    downloadById: async (req: Request, res: Response) => {
        const id = req.params.id;
        const { bucket, client } = await ConnectToDb();
        const existing = await FileExistsById({ client, id });
        if (!existing) {
            return res.status(404).end();
        }

        const downloadStream = bucket.openDownloadStream(new ObjectId(id));
        downloadStream.pipe(res);
    },
};

export default FileController;
