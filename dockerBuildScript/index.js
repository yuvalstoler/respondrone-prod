const yaml = require('js-yaml');
const fs = require('fs');
const utils = require('./utils');
const lineByLine = require('n-readlines');

const rootOfRepositories = '../repositories/';
//'/home/drones/respondrone-master/repositories/entityRep/config/';

const exclude_file_projconf = 'projConf.json';
const projconfs = {};
const names = {};
const ports = {};


const pathTemplate = './template/';
const templatesFiles = {};
templatesFiles.ProjConfFile = 'projConf.json';
templatesFiles.DockerComposeFile = 'docker-compose.yml';
templatesFiles.DockerFile = 'Dockerfile.json';
templatesFiles.MongoConnector = 'mongoConnector.json';
templatesFiles.PackageJson = 'package.json';
templatesFiles.dockerComposePlus = 'dockerComposePlus.yml';
const templates = {};
const excludeFolders4copy = ['config', 'template'];
const targetPath = '../../RD/';
if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
}

if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
}
const foldersOfRepositoies = ['discoveryRep', 'entityRep', 'telemetryReceiverRep', 'telemetrySenderRep'];
const mapServiceGroupInitName = {
    discoveryRep: 'EntityService',
    entityRep: 'EntityService',
    telemetryReceiverRep: 'TelemetryService',
    telemetrySenderRep: 'TelemetryService',
}
//read current confs
//config/
foldersOfRepositoies.forEach((nameOfGroupRepositories) => {
    const configFolder = rootOfRepositories + nameOfGroupRepositories + '/config/';
    fs.readdirSync(configFolder).forEach(file => {
        if (file !== exclude_file_projconf) {
            const data = fs.readFileSync(configFolder + file, 'utf8');
            const data1 = JSON.parse(data);
            projconfs[configFolder + file] = data1;
            names[configFolder + file] = {};
            names[configFolder + file].serviceName = data1.serviceName;
            names[configFolder + file].nameOfGroupRepositories = nameOfGroupRepositories;
            /* namesNew2namesOrig[]*/
            ports[configFolder + file] = data1[mapServiceGroupInitName[nameOfGroupRepositories]].port;
        }
    });
});
//read templates
for (let prop in templatesFiles) {
    const data = fs.readFileSync(pathTemplate + templatesFiles[prop], 'utf8');
    if (templatesFiles[prop].indexOf('.yml') > 0) {
        templates[prop] = yaml.safeLoad(data);
    } else if (templatesFiles[prop].indexOf('.json') > 0) {
        templates[prop] = JSON.parse(data);
    } else {
        templates[prop] = data;
    }

}
//prepare projconf
for (let key in projconfs) {
    projconfs[key].LogsMongo = templates.ProjConfFile.LogsMongo;
    for (let mongoKey in templates.ProjConfFile.Mongo) {
        if (projconfs[key].hasOwnProperty('Mongo')
            && projconfs.hasOwnProperty(key) && projconfs[key].hasOwnProperty('Mongo')
        ) {
            projconfs[key].Mongo[mongoKey] = templates.ProjConfFile.Mongo[mongoKey];
        }
    }
    if (projconfs[key].hasOwnProperty('Mongo')) {
        delete projconfs[key].Mongo.url;
    }
}

for (let prop in names) {
    const pathBase = rootOfRepositories;

    fs.readdirSync(pathBase + names[prop].nameOfGroupRepositories).forEach(file => {
        if (!fs.existsSync(targetPath + names[prop].nameOfGroupRepositories)) {
            fs.mkdirSync(targetPath + names[prop].nameOfGroupRepositories);
        }
        if (!fs.existsSync(targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName)) {
            fs.mkdirSync(targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName);
        }
        if (fs.lstatSync(pathBase + names[prop].nameOfGroupRepositories + '/' + file).isDirectory()) {

            let contain = false;
            excludeFolders4copy.forEach(function (name) {
                if ((pathBase + names[prop].nameOfGroupRepositories + '/' + file).indexOf(name) !== -1) {
                    contain = true;
                }
            });
            if (!contain) {
                utils.copyFolderRecursiveSync(pathBase + names[prop].nameOfGroupRepositories + '/' + file, targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName);
            }
        } else {
            if (file === 'package.json') {
                const data = fs.readFileSync(pathBase + names[prop].nameOfGroupRepositories + '/' + file, 'utf8');
                const dataObj = JSON.parse(data);
                dataObj.dependencies.typescript = templates.PackageJson.dependencies.typescript;
                let keysPackJSON = ['tsc', 'start'];
                dataObj.scripts = templates.PackageJson.scripts;

                keysPackJSON.forEach((keyPackJSON) => {
                    const arrStr = dataObj.scripts[keyPackJSON].split('cd /usr/src/');
                    let oldName = arrStr[1].split(' ');
                    oldName[0] = names[prop].nameOfGroupRepositories;
                    let strEnd = ' ';
                    for (let i = 1; i < oldName.length; i++) {
                        strEnd += oldName[i] + ' ';
                    }

                    let fullString = 'cd /usr/src/' + oldName[0] + strEnd;
                    if (keyPackJSON === 'start') {
                        fullString = 'cd /usr/src/' + oldName[0] + '/dist' + strEnd;
                    }
                    dataObj.scripts[keyPackJSON] = fullString;
                });

                fs.writeFileSync(targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/' + file, JSON.stringify(dataObj), 'utf8');

            }else {
              //  fs.writeFileSync(targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/' + file);
                utils.copyFileSync(pathBase + names[prop].nameOfGroupRepositories + '/' + file, targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/' + file);
            }
            //
        }
    });

    const mongoConnector = targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/src/services/mongo/mongoConnector.ts';
    //correct mongoConnector
    const lines = [];
    if (fs.existsSync(mongoConnector)) {
        const liner = new lineByLine(mongoConnector);
        while (line = liner.next()) {
            let lineStr = line.toString('utf-8');
            for (let mongoConnectorKey in templates.MongoConnector) {
                if (templates.MongoConnector.hasOwnProperty(mongoConnectorKey) && lineStr.indexOf(mongoConnectorKey) > -1) {
                    //console.log(lineStr);
                    lineStr = templates.MongoConnector[mongoConnectorKey];
                }
            }
            lines.push(lineStr)
        }
        fs.writeFileSync(mongoConnector, '', 'utf-8');
        lines.forEach((l) => {
            fs.appendFileSync(mongoConnector, l + '\n');
        });
    }

//dockerfile
    const dockerLines = [];
    templates.DockerFile.forEach((dockerLine) => {
        if (dockerLine.indexOf('$name') > -1) {
            dockerLine = dockerLine.replace(/\$name/g, names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName);

        }
        if (dockerLine.indexOf('$port') > -1) {
            dockerLine = dockerLine.replace(/\$port/g, +ports[prop]);

        }
        dockerLines.push(dockerLine);
    });
    //save Dockerfile
    const Dockerfile = targetPath + '/' + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/' + 'Dockerfile';
    fs.writeFileSync(Dockerfile, '');


    dockerLines.forEach((l) => {
        fs.appendFileSync(Dockerfile, l + '\n');
    });
    let currentTemplate = JSON.parse(JSON.stringify(templates.dockerComposePlus.services));
    currentTemplate[names[prop].serviceName] = currentTemplate.$name;
    delete currentTemplate.$name;
    currentTemplate[names[prop].serviceName].ports = [ports[prop] + ':' + ports[prop]];
    currentTemplate[names[prop].serviceName].build.dockerfile = names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/Dockerfile';
    templates.DockerComposeFile.services[names[prop].serviceName.toLowerCase()] = currentTemplate[names[prop].serviceName];

    if (!fs.existsSync(targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/config')) {
        fs.mkdirSync(targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/config');
    }


    fs.writeFileSync(targetPath + names[prop].nameOfGroupRepositories + '/' + names[prop].serviceName + '/config/projConf.json', JSON.stringify(projconfs[prop]), 'utf-8');

}
const dockerComposeNew = yaml.safeDump(templates.DockerComposeFile);
fs.writeFileSync(targetPath + 'docker-compose.yml', dockerComposeNew, 'utf-8')
console.log('end');
