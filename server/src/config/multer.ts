import multer from "multer";
import path from "path";
import crypto from "crypto";

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads', 'pointsImage'),
        filename: (req, file, callback) => {
            const hash = crypto.randomBytes(6).toString('hex');
            const extension = file.originalname.split('.');
            const filename = `${crypto.createHash('md5').update(`${file.originalname}${hash}`).digest("hex")}.${extension[extension.length-1]}`;

            callback(null, filename);
        }
    }),
}