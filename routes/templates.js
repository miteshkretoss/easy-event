const express = require('express');
const router = express.Router();
const fs = require('fs');
const base64 = require('base64-js');
const ffmpeg = require('fluent-ffmpeg');
const { render } = require('@nexrender/core')


async function readingDirectory(folderPath) {
  try {
    const coustomedata = [];
    const files = await fs.promises.readdir(folderPath);

    // Filter for MP4 files
    const mp4Files = files.filter((file) => file.endsWith('.mp4'));

    // Use Promise.all to wait for all readFile operations to complete
    await Promise.all(mp4Files.map(async (file) => {
      const filePath = `${folderPath}/${file}`;

      try {
        const data = await fs.promises.readFile(filePath);
        const base64Data = base64.fromByteArray(data);

        coustomedata.push({
          id: file.split(".mp4")[0],
          name: file,
          data: base64Data,
        });
      } catch (err) {
        // Handle read file error if needed
        console.error("Error reading file:", err);
      }
    }));

    return coustomedata;
  } catch (err) {
    throw err;
  }
}

// Define user routes
router.get('/', async (req, res) => {


  const coustomedata = [];

  const folderPath = './template-output'; // Replace with the path to your folder

  try {
    const data = await readingDirectory(folderPath);
    return res.status(200).json({ status: 200, data: data, massage: "this is your tamplates" });
  } catch (err) {
    return res.status(500).json({ status: 500, data: [], massage: "internal server error" });
  }
});

router.get('/:id', async (req, res) => {
  const folderPath = './jsons';
  const userId = req.params.id;
  const files = await fs.promises.readdir(folderPath);

  // Filter for MP4 files
  const jsonFile = files.filter((file) => file.endsWith('.json')).find(file => file === `${userId}.json`);
  new Promise(async () => {
    const filePath = `${folderPath}/${jsonFile}`;

    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);

      console.log("🚀🚀🚀 ~ file: templates.js:79 ~ awaitPromise ~ jsonData:-", jsonData);
      return res.status(200).json({ status: 200, data: jsonData?.assets, massage: "this is your tamplates" });

    } catch (err) {
      // Handle read file error if needed
      return res.status(500).json({ status: 500, data: [], massage: "internal server error" });
    }
  });
});

router.post('/:id', async (req, res) => {
  const folderPath = './jsons';
  const userId = req.params.id;
  const files = await fs.promises.readdir(folderPath);

  // Filter for MP4 files
  const jsonFile = files.filter((file) => file.endsWith('.json')).find(file => file === `${userId}.json`);
  new Promise(async () => {
    const filePath = `${folderPath}/${jsonFile}`;

    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);
      const outputFileName = userId + Date.now()
      // Define the output directory
      const outputDir = '/results';

      // Ensure the directory exists; if not, create it
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }


      const templatePath = `file:///D:/Mitesh/Node/easy-event/templates/${userId}.aep`;

      // Define the output path for the rendered video
      const outputPath = `D:/Mitesh/Node/easy-event/results/${outputFileName}.mp4`;
      const main = async () => {
        const newJsonData = {
          ...jsonData,
          template: {
            ...jsonData.template,
            src: `${templatePath}`
          },
          actions: {
            ...jsonData.actions,
            postrender: jsonData?.actions?.postrender?.map(ele => {
              if (ele.module === '@nexrender/action-copy') {
                return {
                  ...ele,
                  output: outputPath
                }
              } else {
                return ele
              }
            }),
          },
          assets: req.body
        }

        // Render the video
        const result = await render(newJsonData);
        if (result.error) {
          throw new Error(result.error);
        }
      }
      await main().then(data => {

      }).finally(() => {
        (async () => {
          try {
            const data = await fs.promises.readFile(`./results/${outputFileName}.mp4`);
            const base64Data = base64.fromByteArray(data);
            return res.status(200).json({ status: 200, data: { name: `${userId}.mp4`, fileData: base64Data, }, massage: `Video rendered successfully!` });
          } catch (err) {
            // Handle read file error if needed
            console.error("Error reading file:", err);
          }
        })();
        console.log('done')
      }).catch(console.error)

    } catch (err) {
      // Handle read file error if needed
      return res.status(500).json({ status: 500, data: [], massage: "internal server error" });
    }
  });
});

module.exports = router;
