const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

// https://qiita.com/shisama/items/affb219514eb1166198e
const showFiles = (dirpath, callback) => {
    fs.readdir(dirpath, { withFileTypes: true }, (err, dirents) => {
        if (err) {
            console.error(err);
            return;
        }

        for (const dirent of dirents) {
            const fp = path.join(dirpath, dirent.name);
            if (dirent.isDirectory()) {
                showFiles(fp, callback);
            } else {
                callback(fp);
            }
        }
    });
}

const assignImage = (imgs, dirpath, output_path) => {
    fs.readdir(dirpath, { withFileTypes: true }, (err, dirents) => {
        let idx = 0;
        if (err) {
            console.error(err);
            return;
        }

        for (const dirent of dirents) {
            const fp = path.join(dirpath, dirent.name);
            if (dirent.isDirectory()) {
                assignImage(imgs, fp, output_path);
            } else {
                ext = path.extname(fp)
                if ((ext === ".jpg") || (ext === ".png") || (ext === ".jpeg") || (ext === ".svg")) {
                    ss = fp.split("/")
                    cat = ss[ss.length - 2]

                    imgs.push(
                        {
                            "index": `${cat}-${idx}`,
                            "name": path.basename(fp).split(".")[0],
                            "src": path.relative("./public", fp),
                            "category": cat
                        }
                    );
                    idx += 1;
                } else {
                    // console.log(`${fp} is not image file`);
                }
                // console.log(imgs);
                // console.log(fp);
            }
        }
        // todo: stop calling repeatedly
        s = JSON.stringify({ "images": imgs });
        // console.log(imgs)
        fs.writeFileSync(output_path, s);
    });
    // console.log(`imgs: ${imgs}`);
}

output_name = "output.json";
if (process.argv.length >= 4) {
    output_name = process.argv[3];
}

input_name = process.argv[2]

if (input_name === "-h" || input_name === "--help") {
    console.log("usage: node [-h] action.js root img_dir filename");
    console.log("")
    console.log("  create image list for gallery pages")
    console.log("")
    console.log("positional arguments:")
    console.log("  root\t root path of react.js app")
    console.log("  img_dir\t directory containing images")
    console.log("  filename\t filename of image list")
    console.log("options:")
    console.log("  -h, --help\tshow this help message and exit");
    process.exit(0)
}
// print file list for debug
showFiles(input_name, console.log);

if (process.env.GITHUB_REPOSITORY) {
    if (process.env.GITHUB_REPOSITORY !== "botamochi6277/reactjs-gallery-action") {
        // remove sample images
        fse.remove('imgs', (err) => {
            if (err) throw err;

            console.log('remove imgs');
        });
    }
}

// run in github workspace
if (process.env.GITHUB_WORKSPACE) {


    // copy
    console.log(`github workspace : ${process.env.GITHUB_WORKSPACE}`)
    fse.copySync("/code/build/", process.env.GITHUB_WORKSPACE)


    // https://note.com/tably/n/n46041458d6b3
    // move to github workspace

    const workspace = process.env.GITHUB_WORKSPACE;
    // const targetDir = process.env.INPUT_TARGET_DIRECTORY;
    // process.env.GITHUB_WORKSPACE = `${workspace}/${targetDir}`;
    process.chdir(workspace);
}

assignImage(new Array(), input_name, output_name);
console.log(`save image list in ${output_name}`)

