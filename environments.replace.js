const fs = require('fs');
const path = require('path');

const dir = "src/environments";
const file = "environment.ts";
const fileDev = "environment.development.ts";
const filePrd = "environment.prod.ts";

const content = `${process.env.FIREBASE_DETAILS}`;

fs.access(dir, fs.constants.F_OK, (err) => {
    if(err) {
        console.log('src doesnt exist, creating', process.cwd());
        fs.mkdir(dir, {recursive: true} , (err) => {
            if (err) throw err;
        });
    }
    try {
        fs.writeFileSync(dir + '/' + file, content);
        fs.writeFileSync(dir + '/' + filePrd, content);
        fs.writeFileSync(dir + '/' + fileDev, content);
        console.log('Created OK', process.cwd());
        if(fs.existsSync(dir + "/" + file)) {
            console.log('File is created', path.resolve(dir + "/" + file));
            const str = fs.readFileSync(dir + "/" + file).toString();
            console.log(str)
        }
        if(fs.existsSync(dir + "/" + filePrd)) {
            console.log('File is created PRD', path.resolve(dir + "/" + filePrd));
            const str = fs.readFileSync(dir + "/" + filePrd).toString();
            console.log(str)
        }
        if(fs.existsSync(dir + "/" + fileDev)) {
            console.log('File is created DEV', path.resolve(dir + "/" + fileDev));
            const str = fs.readFileSync(dir + "/" + fileDev).toString();
            console.log(str)
        }
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
});