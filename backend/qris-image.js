import Jimp from "jimp";
import QrCode from "qrcode-reader";

export async function decodeQRFromImage(buffer) {
  return new Promise((resolve, reject) => {
    Jimp.read(buffer, (err, image) => {
      if (err) return reject(err);
      const qr = new QrCode();
      qr.callback = (err, value) => {
        if (err) return reject(err);
        resolve(value.result);
      };
      qr.decode(image.bitmap);
    });
  });
}
