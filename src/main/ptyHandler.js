import * as pty  from "node-pty"
import os from "os";
import settingsManager from "./settingsManager";
import fs from "fs";

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

let location = "./";
const extractFolder = settingsManager.appdata + "/projects/extract";

function buildCmdString(letter, id, fileExt) {
  return `./swfextract -${letter} ${id} "${settingsManager.appdata}/projects/dirkvalentine.swf" -o "${extractFolder}/${id}.${fileExt}" \r`;
}

export default {
  setPtyLocation(dir) {
    ptyProcess.write(`cd "${dir}" \r`);
    const listener = ptyProcess.onData((data) => {
      console.log("Data: " + data);
      if(["no such file or directory","it does not exist"].some(el => data.toLowerCase().includes(el))) {
        throw new Error("The file or directory does not exist");
      }
      else {
        location = dir;
      }
      listener.dispose();
    });
  },

  useSwfextract(callback) {
    console.log("Extracting SWF file assets");
    const swftoolsPath = settingsManager.getSetting("swftoolsPath");
    this.setPtyLocation(swftoolsPath);

    if (!fs.existsSync(extractFolder)){
      fs.mkdirSync(extractFolder);
    }

    const pngIds = [6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,137,140,143,146,149,152,155,158,161,164,167,189,191,207,209,211,213,221,224,230,233,245,248,251,254,258,262,264,266,268,272,275,278,283,285,287,289,294,296,299,301,303,306,308,310,312,314,316,318,320,322,334,337,340,343,346,349,352,355,358,361,363,365,367,371,374,377,379,381,385,387,392,394,396,398,400,402,404,408,413,416,419,422,425,428,431,434,437,440,443,446,449,452,455,458,461,464,467,470,473,476,479,482,485,488,491,494,497,500,503,506,509,512,515,518,521,524,527,530,533,536,539,542,544,545,548,551,553,557,560,563,566,569,572,575,578,581,584,587,590,593,596,599,602,605,626,629,632,635,638,641,644,646,648,650,652,660,662,665,667,669,671,673,675,684,686,688,690,692,694,696,698,701,703,705,707,709,711,714,716,718,720,722,724,726,728,731,735,737,739,741,743,745,748,750,752,755,757,759,761,763,765,769,780,795,832,844,847,850,853,856,858,860,862,873,875,877,879,881,883,885,887,889,891,893,895,906,914,922,924,926,928,930,932,934,936,938,940,943,947,949,951,971,973,975,977,979,981,983,1012,1015,1018,1021,1024,1027,1083,1086,1093,1096,1103,1106,1113,1115,1117,1119,1122,1124,1126,1129,1135,1139,1141,1143,1148,1150,1152,1154,1156,1158,1169,1172,1174,1176,1178,1180,1182,1184,1186,1188,1190,1192,1203,1205,1207,1209,1211,1215,1217,1218,1222,1224,1230,1232,1234,1236,1239,1241,1243,1245,1248,1250,1252,1254,1257,1259,1261,1263,1265,1267,1269,1271,1274,1276,1278,1280,1282,1284,1286,1288,1290,1292,1304,1306,1309,1311,1313,1315,1324,1326,1328,1330,1332,1334,1336,1338,1340,1342,1345,1349,1351,1353,1355,1358,1361,1364,1367,1370,1373,1376,1379,1382,1384,1385,1387,1392,1394,1395,1405,1415,1420,1422,1426,1429,1431,1434,1438,1466,1477,1540,1541,1542,1543,1544,1545,1549,1553,1557,1562,1564,1566,1569,1571,1577,1578,1579,1580,1581,1584,1586,1590,1593,1595,1601,1604,1611,1613,1615,1617,1619,1624,1627,1629,1632]
    const jpegIds = [239, 281, 608, 611, 614, 617, 620, 623, 654, 656, 658, 814, 817, 819, 821, 823, 825, 827, 829, 870, 903, 945, 953, 955, 957, 959, 961, 963, 965, 967, 985, 987, 989, 991, 993, 995, 1054, 1056, 1058, 1060, 1062, 1064, 1066, 1068, 1201]

    let dataDump = "";

    let count = 0;
    const numToExtract = (pngIds.length + jpegIds.length);
    const listener = ptyProcess.onData( data => {  // pass to UI later for feedback
        const fileCount = fs.readdirSync(extractFolder).length;
        if(fileCount > count) {
          count = fileCount;
          callback({"Extract progress":[count, numToExtract]});
        }
        if(count === numToExtract) {
          console.log("Done!")
          listener.dispose();
        }
    });

    pngIds.forEach(async id => {
      const cmdString = buildCmdString("p", id, "png");
      ptyProcess.write(cmdString);
      
    });
    jpegIds.forEach(id => {
      ptyProcess.write(buildCmdString("j", id, "jpeg"));
    });

    //listener.dispose();
  }

}



