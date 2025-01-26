import cv from '@techstark/opencv-js';

// Image Processing

export const preprocessImageAndExtractRows = async (imagePath: string) => {
  return new Promise<{ rowDataUrls: string[][]; processedImageUrl: string }>((resolve, reject) => {
    const imgElement = document.createElement('img');
    imgElement.src = imagePath;

    imgElement.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const naturalWidth = imgElement.naturalWidth;
        const naturalHeight = imgElement.naturalHeight;

        // Adjusted Position to zoom into scoreboard
        const naturalXPosition = 220;
        const naturalYPosition = 230;

        const WIDTH_MULTIPLIER = 0.640625;
        const HEIGHT_MULTIPLIER = 0.4722222222222222;
        const POS_MULTIPLIER = imgElement.naturalWidth / 1280;

        const WIDTH = naturalWidth * WIDTH_MULTIPLIER;
        const HEIGHT = naturalHeight * HEIGHT_MULTIPLIER;
        const xPosition = naturalXPosition * POS_MULTIPLIER * -1; // Scoreboard Position
        const yPosition = naturalYPosition * POS_MULTIPLIER * -1; // Scoreboard Position
        const resizedMultiplier = 8;

        if (ctx) {
          canvas.width = WIDTH;
          canvas.height = HEIGHT;

          ctx.drawImage(imgElement, xPosition, yPosition);

          const src = cv.imread(canvas);

          cv.resize(src, src, new cv.Size(WIDTH * resizedMultiplier, HEIGHT * resizedMultiplier), 0, 0, cv.INTER_CUBIC);

          // Convert to grayscale
          cv.cvtColor(src, src, cv.COLOR_BGR2GRAY);

          // Apply Erosion and Dilation
          const kernel = cv.Mat.ones(5, 5, cv.CV_8U); // 5x5 kernel
          cv.erode(src, src, kernel, new cv.Point(-1, -1), 1); // 1 iteration of erosion
          cv.dilate(src, src, kernel, new cv.Point(-1, -1), 1); // 1 iteration of dilation
          kernel.delete();

          // Apply Thresholding
          cv.threshold(src, src, 127, 255, cv.THRESH_BINARY_INV);

          const processedImageUrl = canvas.toDataURL();

          // Define row height and column widths
          const rowHeight = (HEIGHT * resizedMultiplier) / 10;
          const colWeights = [0.29, 0.12, 0.04, 0.04, 0.058, 0.14, 0.1, 0.1, 0.1]; // Widths are manually adjusted
          const totalWidth = src.cols; // Total width of the image

          // Calculate column widths dynamically based on weights
          const colWidths = colWeights.map((weight) => Math.floor(weight * totalWidth));
          const rows: cv.Mat[][] = [];
          const numRows = Math.floor(src.rows / rowHeight);

          // Extract each row and its cells
          for (let i = 0; i < numRows; i++) {
            const y = i * rowHeight;
            if (y + rowHeight <= src.rows) {
              const rowCells: cv.Mat[] = [];
              let x = 0;

              for (const width of colWidths) {
                if (x + width <= src.cols) {
                  const cell = src.roi(new cv.Rect(x, y, width, rowHeight));
                  rowCells.push(cell);
                  x += width; // Move to the next cell
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

          src.delete();
          resolve({ rowDataUrls, processedImageUrl });
        } else {
          reject(new Error('Failed to get 2D context from canvas.'));
        }
      } catch (err) {
        reject(err);
      }
    };

    imgElement.onerror = () => {
      reject(new Error('Failed to load the image for preprocessing.'));
    };
  });
};
