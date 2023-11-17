import { Request, Response } from 'express';
import { ConnectToDb, FileExistsById } from '../models/File';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';


const FileController = {
    handleUpload: async (req: Request, res: Response) => {
        const { bucket } = await ConnectToDb();
        const files = req.files as Express.Multer.File[];
        // uploadedFileIds is dictionary of filename: ids
        const uploadedFileIds: { [filename: string]: string } = {};

        for (const file of files) {
            const { originalname, buffer, mimetype } = file;

            const filename = originalname.replace(/[^a-z0-9]/gi, '-').toLowerCase();

            const stream = Readable.from(buffer);

            const uploadStream = bucket.openUploadStream(filename, {
                contentType: mimetype,
            });
            stream.pipe(uploadStream);

            uploadedFileIds[originalname] = uploadStream.id.toString();
        }
        res.status(201).json({ ...uploadedFileIds });
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
