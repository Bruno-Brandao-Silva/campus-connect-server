import { Request, Response } from 'express';
import { ConnectToDb, FileExistsById } from '../models/File';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';


const FileController = {
    handleUpload: async (req: Request, res: Response) => {
        try {
            const { bucket } = await ConnectToDb();
            const files = req.files as Express.Multer.File[];
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
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error uploading file' });
        }
    },

    downloadById: async (req: Request, res: Response) => {
        try {
            const id = new ObjectId(req.params.id);
            const { bucket, client } = await ConnectToDb();
            const existing = await FileExistsById({ client, id });
            if (!existing) {
                return res.status(404).end();
            }

            const downloadStream = bucket.openDownloadStream(new ObjectId(id));
            downloadStream.pipe(res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error downloading file' });
        }
    },
    deleteById: async (req: Request, res: Response) => {
        try {
            const id = new ObjectId(req.params.id);
            const { bucket, client } = await ConnectToDb();
            const existing = await FileExistsById({ client, id });
            if (!existing) {
                return res.status(404).end();
            }
            bucket.delete(new ObjectId(id));
            res.status(200).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting file' });
        }
    }
};

export default FileController;
