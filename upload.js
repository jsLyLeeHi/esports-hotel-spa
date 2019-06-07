const Oss = require('ali-oss'),
    Fs = require('fs'),
    Pkg = require('./package.json');

function isFile() {
    return new Promise((resolve, reject) => {
        Fs.readdir(__dirname, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                data.forEach(item => {
                    if (item.startsWith('dist') == true) {
                        resolve(item);
                    }
                });
            }
        });
    });
}
isFile()
    .then(value => {
        console.log(value);
        let indexValue = Fs.readdirSync(`./${value}`),
            allFile = [];
        indexValue.forEach(item => {
            let filePath = value + '/' + item;
            if (item.startsWith('index')) {
                allFile.push(value + '/' + item);
            } else {
                let url = Fs.readdirSync(filePath);
                url.forEach(itemChild => {
                    allFile.push(value + '/' + item + '/' + itemChild);
                });
            }
        });
        allFile = [].concat.apply([], allFile);
        allFile.forEach(item => {
            let client = new Oss({
                accessKeyId: 'LTAI8W68cA9ANXFo',
                accessKeySecret: 'BrJb5Vaav2JrW8eDRjfwOzYP4IX0Il',
                bucket: 'lzhtml',
                region: 'oss-cn-beijing'
            });
            async function put() {
                try {
                    let result = await client.put(`wap/${Pkg.name}/${item}`, `${item}`);
                    console.log(result);
                } catch (error) {
                    console.log(error);
                }
            }
            put();
        });
    })
    .catch(err => {
        console.log('\x1B[36m%s\x1B[0m', err);
    });
