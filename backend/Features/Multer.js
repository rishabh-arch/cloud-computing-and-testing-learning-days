const fs = require('fs')
const sharp = require('sharp')
const fsAccess = (loc) => {
    fs.access(loc, (err) => {
        if (err)
            fs.mkdirSync(loc);
    })

}
const createId = () => {
    return new Date().getTime().toString();
}

const imageProcess = async (req) => {

    fsAccess('frontend/build/uploads/');
    fsAccess('frontend/build/uploads/thumbnail');
    const id = createId();
    const formatedName = req.file.originalname.split(' ').join('-');
    const filename = `${id}-${formatedName}`;
    try {
        await sharp(req.file.path).jpeg({ quality: 60 })
            .toFile('frontend/build/uploads/' + filename)

        await sharp(req.file.path).resize(242,184)
            .toFile('frontend/build/uploads/thumbnail/' + filename)
        fs.unlinkSync(req.file.path)
        return filename;
    }
    catch (error) {
        return error;

    }
}
module.exports = imageProcess;