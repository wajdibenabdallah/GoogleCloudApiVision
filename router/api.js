const express = require('express');
const router = express.Router();
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const multer = require('multer');
let uploadUri = 'uploads/';
const fs = require('fs');
const rgbHex = require('rgb-hex');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(uploadUri)) {
            fs.mkdirSync(uploadUri);
        }
        cb(null, uploadUri)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

async function colorDetector() {
    let files = fs.readdirSync(uploadUri);
    let data = [];
    for (let i = 0; i < files.length; i++) {
        let uriFile = uploadUri + files[i];

        const [labelDetectionResult] = await client.labelDetection(uriFile);
        const labels = labelDetectionResult.labelAnnotations;
        let isAcar = false;
        labels.forEach(label => {
            if (!isAcar && ((label.description.indexOf('vehicle') !== -1) || (label.description.indexOf('car') !== -1)))
                isAcar = true;
        });

        const [imagePropertiesResult] = await client.imageProperties(uriFile);
        const colors = imagePropertiesResult.imagePropertiesAnnotation.dominantColors.colors;
        let score = 0;
        let colorDetected = 'none';
        colors.forEach(color => {
            if (color.score > score) {
                colorDetected = color.color
            }
        });
        data.push({
            uri: '10.2.32.35:3000/' + uriFile,
            car: isAcar,
            colorHex: rgbHex(colorDetected.red, colorDetected.green, colorDetected.blue)
        })
    }
    return data;
}

router.post('/detection', upload.any(), function (req, res) {
    colorDetector(req.get('host')).then((data) => {
        res.send(data);
    });
})

module.exports = router;