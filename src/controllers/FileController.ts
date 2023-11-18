import { Request, Response } from 'express';
import { ConnectToDb, FileExistsById, GetFileById } from '../models/File';
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
            const range = req.headers.range || 'bytes=0-';

            const _id = new ObjectId(req.params.id);

            const { bucket, client } = await ConnectToDb();

            const file = await GetFileById({ client, _id });

            if (!file) return res.status(404).end();

            const streamStart = Number(range.replace(/\D/g, ""));
            const streamEnd = file.length - 1;


            const downloadStream = bucket.openDownloadStream(_id, { start: streamStart, end: file.length });

            res.status(206).set({
                "Content-Range": `bytes ${streamStart}-${streamEnd}/${file.length}`,
                "Accept-Ranges": "bytes",
                "Content-Length": (streamEnd - streamStart + 1).toString(),
                "Content-Type": file.contentType || "application/octet-stream",
                "Cache-Control": "public, max-age=31536000, immutable",
            });

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
