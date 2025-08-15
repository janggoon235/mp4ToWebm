import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // 추가
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg"; // 추가

const __filename = fileURLToPath(import.meta.url); // 추가
const __dirname = path.dirname(__filename); // 추가

const importDir = path.resolve(__dirname, "./import");
const exportDir = path.resolve(__dirname, "./export");

const ffmpegPath = ffmpegInstaller.path;

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir);
}

fs.readdirSync(importDir)
  .filter((f) => f.toLowerCase().endsWith(".mp4"))
  .forEach((file) => {
    const input = path.join(importDir, file);
    const output = path.join(exportDir, file.replace(/\.mp4$/i, ".webm"));
    const cmd = `"${ffmpegPath}" -y -i "${input}" -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis "${output}"`; // 수정

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(`✖ Failed: ${file}`, err);
      } else {
        console.log(`✔ Converted: ${file} → ${path.basename(output)}`);
      }
    });
  });
