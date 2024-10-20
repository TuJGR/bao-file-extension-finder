// findFileTypes.js

const fs = require('fs');
const path = require('path');

// Get the relative folder path from the command-line argument and resolve it to an absolute path
const folderPath = path.resolve(process.cwd(), process.argv[2]);

// List of file extensions to search for
const fileExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', // Image formats
    '.mp4', '.mov', // Video formats
];

// Function to check if the string contains any of the specified extensions
const containsFileType = (str) => {
    return fileExtensions.some(extension => str.includes(extension));
};

// Function to read the file and search for file types
const searchFileTypes = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading file: ${err.message}`);
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                const uniquePaths = new Set(); // Use a Set to store unique paths

                // Recursive function to search through the JSON object
                const searchObject = (obj) => {
                    for (const key in obj) {
                        if (typeof obj[key] === 'string' && containsFileType(obj[key])) {
                            // Extract the filename and extension
                            const fileNameWithExt = obj[key].split('/').pop(); // Get the filename and extension
                            uniquePaths.add(`/${fileNameWithExt}`); // Add to Set (removes duplicates automatically)
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            searchObject(obj[key]);
                        }
                    }
                };

                searchObject(jsonData);

                // Convert Set back to an array for output
                resolve(Array.from(uniquePaths));
            } catch (parseError) {
                reject(`Error parsing JSON: ${parseError.message}`);
            }
        });
    });
};

// Function to process all files in a folder
const processFolder = async (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);

        let allPaths = new Set(); // Set to hold all unique paths from multiple files

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile()) {
                console.log(`Processing file: ${filePath}`);
                const filePaths = await searchFileTypes(filePath);
                filePaths.forEach(filePath => allPaths.add(filePath));
            }
        }

        // Output the found file paths from all files
        console.log('Found file paths:\n');
        allPaths.forEach(filePath => console.log(filePath)); // Each path on a new line
        console.log(`\nTotal unique files found: ${allPaths.size}`);
    } catch (err) {
        console.error(`Error processing folder: ${err.message}`);
    }
};

// Start processing the folder
processFolder(folderPath);
