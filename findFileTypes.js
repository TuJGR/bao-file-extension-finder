const fs = require('fs');
const path = require('path');
const readline = require('readline');

// List of file extensions to search for
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const videoExtensions = ['.mp4', '.mov'];

// Function to check if the string contains an image file type
const isImageType = (str) => {
    return imageExtensions.some(extension => str.includes(extension));
};

// Function to check if the string contains a video file type
const isVideoType = (str) => {
    return videoExtensions.some(extension => str.includes(extension));
};

// Function to read the file and search for file types
const searchFileTypes = (filePath, imageBaseUrl, videoBaseUrl) => {
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
                        if (typeof obj[key] === 'string' && (isImageType(obj[key]) || isVideoType(obj[key]))) {
                            // Extract the filename and extension
                            const fileNameWithExt = obj[key].split('/').pop(); // Get the filename and extension

                            // Determine if the file is an image or video and apply the appropriate base URL
                            if (isImageType(fileNameWithExt)) {
                                uniquePaths.add(`${imageBaseUrl}/${fileNameWithExt}`);
                            } else if (isVideoType(fileNameWithExt)) {
                                uniquePaths.add(`${videoBaseUrl}/${fileNameWithExt}`);
                            }
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
const processFolder = async (folderPath, imageBaseUrl, videoBaseUrl) => {
    try {
        const files = fs.readdirSync(folderPath);

        let allPaths = new Set(); // Set to hold all unique paths from multiple files

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile()) {
                console.log(`Processing file: ${filePath}`);
                const filePaths = await searchFileTypes(filePath, imageBaseUrl, videoBaseUrl);
                filePaths.forEach(filePath => allPaths.add(filePath));
            }
        }

        // Output the found file paths from all files
        console.log('\nFound file paths:\n');
        allPaths.forEach(filePath => console.log(filePath)); // Each path on a new line
        console.log(`\nTotal unique files found: ${allPaths.size}`);
    } catch (err) {
        console.error(`Error processing folder: ${err.message}`);
    }
};

// Function to prompt the user for input using readline
const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    }));
};

// Main function to run the interactive CLI
const main = async () => {
    try {
        // Use readline to ask questions step-by-step
        const folderPath = await askQuestion('Enter the folder path containing the JSON files: ');
        const imageBaseUrl = await askQuestion('Enter the base URL for images (or leave empty to skip): ');
        const videoBaseUrl = await askQuestion('Enter the base URL for videos (or leave empty to skip): ');

        // Resolve the folder path
        const resolvedFolderPath = path.resolve(process.cwd(), folderPath);

        // Start processing the folder
        await processFolder(resolvedFolderPath, imageBaseUrl || '', videoBaseUrl || '');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

// Run the main function
main();
