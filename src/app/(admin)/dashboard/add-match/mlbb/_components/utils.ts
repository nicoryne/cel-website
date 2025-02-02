import cv, { cvCeil } from '@techstark/opencv-js';
import { canvas } from 'framer-motion/client';

// Image Processing
// MLBB is much more difficult to OCR. You have to first splice the scoreboard into half, then manually adjust
// according to wherever they place their numbers, then reverse it to get the other half of the scorebard,
// then do that again for the second image.
export const preprocessImageAndExtractRows = async (
  equipmentImagePath: string,
  dataImagePath: string
) => {
  return new Promise<{
    rowDataUrls: string[][];
    processedEquipmentUrl: string;
    processedDataUrl: string;
  }>((resolve, reject) => {
    const equipmentImageElement = document.createElement('img');
    const dataImageElement = document.createElement('img');

    equipmentImageElement.src = equipmentImagePath;
    dataImageElement.src = dataImagePath;

    const loadImage = (imageElement: HTMLImageElement) => {
      return new Promise<void>((resolve, reject) => {
        imageElement.onload = () => resolve();
        imageElement.onerror = () => reject(new Error('Failed to load an image.'));
      });
    };

    Promise.all([loadImage(equipmentImageElement), loadImage(dataImageElement)])
      .then(() => {
        try {
          const canvasEquipment = document.createElement('canvas');
          const canvasData = document.createElement('canvas');
          const ctxEquipment = canvasEquipment.getContext('2d');
          const ctxData = canvasData.getContext('2d');

          // We can just take the screenshot from the equipment image element
          // since we are assuming both images have same height & width
          const naturalWidth = equipmentImageElement.naturalWidth;
          const naturalHeight = equipmentImageElement.naturalHeight;

          // NOTE: alot of the configuration is done through trial and error
          // there aren't any shortcuts, you just gotta adjust and see if it works
          // until it works.

          // Adjusted Position to zoom into scoreboard
          const naturalXPosition = 120;
          const naturalYPosition = 170;

          const WIDTH_MULTIPLIER = 0.8177083333333333;
          const HEIGHT_MULTIPLIER = 0.6481481481481481;
          const POS_MULTIPLIER = equipmentImageElement.naturalWidth / 1280;

          const WIDTH = naturalWidth * WIDTH_MULTIPLIER;
          const HEIGHT = naturalHeight * HEIGHT_MULTIPLIER;
          const xPosition = naturalXPosition * POS_MULTIPLIER * -1; // Scoreboard Position
          const yPosition = naturalYPosition * POS_MULTIPLIER * -1; // Scoreboard Position
          const resizedMultiplier = 8;

          if (ctxEquipment && ctxData) {
            canvasEquipment.width = WIDTH;
            canvasEquipment.height = HEIGHT;
            canvasData.width = WIDTH;
            canvasData.height = HEIGHT;

            ctxEquipment.drawImage(equipmentImageElement, xPosition, yPosition);
            ctxData.drawImage(dataImageElement, xPosition, yPosition);

            const srcEquipment = cv.imread(canvasEquipment);
            const srcData = cv.imread(canvasData);

            const size = new cv.Size(WIDTH * resizedMultiplier, HEIGHT * resizedMultiplier);
            applyResize(srcEquipment, size);
            applyResize(srcData, size);

            applyGrayscale(srcEquipment);
            applyGrayscale(srcData);

            applyErosionDilation(srcEquipment);
            applyErosionDilation(srcData);

            applyThreshold(srcEquipment);
            applyThreshold(srcData);

            const processedEquipmentUrl = canvasEquipment.toDataURL();
            const processedDataUrl = canvasData.toDataURL();

            // Define row height and column widths
            const rowHeight = (HEIGHT * resizedMultiplier) / 5;

            // Calculate column widths dynamically based on weights
            const rows: cv.Mat[][] = [];
            const numRows = Math.floor(srcEquipment.rows / rowHeight);

            // Extract each row and its cells
            for (let i = 0; i < numRows * 2; i++) {
              const y = (i % 5) * rowHeight;
              if (y + rowHeight <= srcEquipment.rows) {
                const rowCells: cv.Mat[] = [];
                for (let j = 0; j < 11; j++) {
                  let cell = null;
                  switch (j) {
                    case 0: // name
                      if (i < 5) {
                        cell = srcEquipment.roi(
                          new cv.Rect(150 * resizedMultiplier, y, 262.5 * resizedMultiplier, 400)
                        );
                      } else {
                        cell = srcEquipment.roi(
                          new cv.Rect(1162.5 * resizedMultiplier, y, 275 * resizedMultiplier, 400)
                        );
                      }
                      break;
                    case 1: // rating
                      if (i < 5) {
                        cell = srcEquipment.roi(
                          new cv.Rect(
                            670 * resizedMultiplier,
                            y + (rowHeight - 400),
                            80 * resizedMultiplier,
                            300
                          )
                        );
                      } else {
                        cell = srcEquipment.roi(
                          new cv.Rect(
                            810 * resizedMultiplier,
                            y + (rowHeight - 400),
                            80 * resizedMultiplier,
                            300
                          )
                        );
                      }
                      break;
                    case 2: // kills
                      if (i < 5) {
                        cell = srcEquipment.roi(
                          new cv.Rect(400 * resizedMultiplier, y + 50, 50 * resizedMultiplier, 300)
                        );
                      } else {
                        cell = srcEquipment.roi(
                          new cv.Rect(1020 * resizedMultiplier, y + 50, 50 * resizedMultiplier, 300)
                        );
                      }
                      break;
                    case 3: // deaths
                      if (i < 5) {
                        cell = srcEquipment.roi(
                          new cv.Rect(450 * resizedMultiplier, y + 50, 50 * resizedMultiplier, 300)
                        );
                      } else {
                        cell = srcEquipment.roi(
                          new cv.Rect(1070 * resizedMultiplier, y + 50, 50 * resizedMultiplier, 300)
                        );
                      }
                      break;
                    case 4: // assists
                      if (i < 5) {
                        cell = srcEquipment.roi(
                          new cv.Rect(500 * resizedMultiplier, y + 50, 50 * resizedMultiplier, 300)
                        );
                      } else {
                        cell = srcEquipment.roi(
                          new cv.Rect(1120 * resizedMultiplier, y + 50, 50 * resizedMultiplier, 300)
                        );
                      }
                      break;
                    case 5: // net worth
                      if (i < 5) {
                        cell = srcEquipment.roi(
                          new cv.Rect(550 * resizedMultiplier, y, 100 * resizedMultiplier, 400)
                        );
                      } else {
                        cell = srcEquipment.roi(
                          new cv.Rect(920 * resizedMultiplier, y, 100 * resizedMultiplier, 400)
                        );
                      }
                      break;
                    case 6: // hero damage
                      if (i < 5) {
                        cell = srcData.roi(
                          new cv.Rect(
                            130 * resizedMultiplier,
                            y + (rowHeight - 720),
                            130 * resizedMultiplier,
                            300
                          )
                        );
                      } else {
                        cell = srcData.roi(
                          new cv.Rect(
                            780 * resizedMultiplier,
                            y + (rowHeight - 720),
                            130 * resizedMultiplier,
                            300
                          )
                        );
                      }
                      break;
                    case 7: // turret damage
                      if (i < 5) {
                        cell = srcData.roi(
                          new cv.Rect(
                            280 * resizedMultiplier,
                            y + (rowHeight - 720),
                            130 * resizedMultiplier,
                            300
                          )
                        );
                      } else {
                        cell = srcData.roi(
                          new cv.Rect(
                            940 * resizedMultiplier,
                            y + (rowHeight - 720),
                            130 * resizedMultiplier,
                            300
                          )
                        );
                      }
                      break;
                    case 8: // damage taken
                      if (i < 5) {
                        cell = srcData.roi(
                          new cv.Rect(
                            430 * resizedMultiplier,
                            y + (rowHeight - 720),
                            130 * resizedMultiplier,
                            300
                          )
                        );
                      } else {
                        cell = srcData.roi(
                          new cv.Rect(
                            1100 * resizedMultiplier,
                            y + (rowHeight - 720),
                            150 * resizedMultiplier,
                            300
                          )
                        );
                      }
                      break;
                    case 9: // teamfight participation
                      if (i < 5) {
                        cell = srcData.roi(
                          new cv.Rect(
                            680 * resizedMultiplier,
                            y + (rowHeight - 400),
                            100 * resizedMultiplier,
                            300
                          )
                        );
                      } else {
                        cell = srcData.roi(
                          new cv.Rect(
                            1320 * resizedMultiplier,
                            y + (rowHeight - 400),
                            100 * resizedMultiplier,
                            300
                          )
                        );
                      }
                      break;
                  }

                  if (cell) {
                    rowCells.push(cell);
                  }
                }

                rows.push(rowCells);
              }
            }

            const rowDataUrls = rows.map((row) => {
              return row.map((cell) => {
                const cellCanvas = document.createElement('canvas');
                cellCanvas.width = cell.cols;
                cellCanvas.height = cell.rows;
                cv.imshow(cellCanvas, cell);
                const dataUrl = cellCanvas.toDataURL();
                cell.delete();
                return dataUrl;
              });
            });

            srcEquipment.delete();
            srcData.delete();
            resolve({ rowDataUrls, processedEquipmentUrl, processedDataUrl });
          } else {
            reject(new Error('Failed to get 2D context from canvas.'));
          }
        } catch (err) {
          reject(err);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const applyResize = (src: cv.Mat, size: cv.Size) => {
  cv.resize(src, src, size, 0, 0, cv.INTER_CUBIC);
};

const applyGrayscale = (src: cv.Mat) => {
  cv.cvtColor(src, src, cv.COLOR_BGR2GRAY);
};

const applyErosionDilation = (src: cv.Mat) => {
  const kernel = cv.Mat.ones(5, 5, cv.CV_8U); // 7x7 kernel
  cv.erode(src, src, kernel, new cv.Point(-1, -1), 1); // 1 iteration of erosion
  cv.dilate(src, src, kernel, new cv.Point(-1, -1), 1); // 1 iteration of dilation
  kernel.delete();
};

const applyThreshold = (src: cv.Mat) => {
  cv.threshold(src, src, 127, 255, cv.THRESH_BINARY_INV);
};
