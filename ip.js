const Os = require('os'),
    Fs = require('fs');

let iptable = {},
    ifaces = Os.networkInterfaces();

function network() {
    for (let i in ifaces) {
        for (let num in ifaces[i]) {
            if (
                ifaces[i][num].family == 'IPv4' &&
                ifaces[i][num].internal == false &&
                ifaces[i][num].address.indexOf('192') == 0
            ) {
                iptable = ifaces[i][num].address;
                return iptable;
            }
        }
    }
}

let ip = network(),
    hostIp = iptable,
    filename = './ip.json',
    host = {
        ip: ip
    };

Fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.log('\x1B[36m%s\x1B[0m', '读取ip操作失败');
        Fs.writeFile(filename, JSON.stringify(host), err => {
            if (err) {
                console.log('\x1B[36m%s\x1B[0m', '写入ip操作失败');
            } else {
                console.log('\x1B[36m%s\x1B[0m', '写入ip操作成功');
            }
        });
    } else {
        if (data == '') {
            Fs.writeFile(filename, JSON.stringify(host), err => {
                if (err) {
                    console.log('\x1B[36m%s\x1B[0m', '写入ip操作失败');
                } else {
                    console.log('\x1B[36m%s\x1B[0m', '写入ip操作成功');
                }
            });
        } else {
            try {
                let { ip } = JSON.parse(data);
                if (hostIp != ip) {
                    Fs.writeFile(filename, JSON.stringify(host), err => {
                        if (err) {
                            console.log('\x1B[36m%s\x1B[0m', '写入ip操作失败');
                        } else {
                            console.log('\x1B[36m%s\x1B[0m', '写入ip操作成功');
                        }
                    });
                } else {
                    console.log('\x1B[36m%s\x1B[0m', 'ip没有改变');
                }
            } catch (err) {
                Fs.writeFile(filename, JSON.stringify(host), err => {
                    if (err) {
                        console.log('\x1B[36m%s\x1B[0m', '写入ip操作失败');
                    } else {
                        console.log('\x1B[36m%s\x1B[0m', '写入ip操作成功');
                    }
                });
            }
        }
    }
});
