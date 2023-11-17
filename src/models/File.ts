// file upload buckt with mongodb
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://192.168.101.6:27017/CCS";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

export async function ConnectToDb(): Promise<{ client: MongoClient; bucket: GridFSBucket }> {
  try {
    const client = new MongoClient(MONGODB_URI, {});
    const bucket = new GridFSBucket(client.db());

    await client.connect();

    return { client, bucket };
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

export async function FileExistsByName({ client, filename }: { client: MongoClient, filename: string }): Promise<boolean> {
  try {
    const count = await client
      .db()
      .collection("fs.files")
      .countDocuments({ filename });

    return !!count;
  } catch (error) {
    console.error("Error checking file existence:", error);
    throw error;
  }
}

export async function FileExistsById({ client, id }: { client: MongoClient, id: string }): Promise<boolean> {
  try {
    let _id;
    try {
      _id = new ObjectId(id);
    } catch (error) {
      return false;
    }
    if (!_id) {
      return false;
    }
    const count = await client
      .db()
      .collection("fs.files")
      .countDocuments({ _id });

    return !!count;
  } catch (error) {
    console.error("Error checking file existence:", error);
    throw error;
  }
}