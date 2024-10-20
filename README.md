# File Type Extractor

This is a Node.js script that extracts unique file URLs with specific extensions (e.g., images and videos) from multiple JSON files inside a specified folder. The program works by scanning all JSON files in the folder, finding all URLs that contain certain file types, and outputting a list of unique file URLs.

## Features
- Extracts URLs containing specified file extensions (e.g., .jpg, .png, .mp4, etc.) from JSON files.
- Supports multiple files in a specified folder.
- Outputs a list of unique file paths.

## Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

## Installation

- Clone the repository or download the findFileTypes.js script.

Navigate to the project folder:

```
cd your-project-directory
```

## Usage
1. Prepare your JSON files:

- Copy your JSON files into a folder relative to where you will run the script. For example, create a folder named json-files in the same directory as the script, and place your JSON files in that folder.

2. Run the script:

```
node findFileTypes.js <relative-folder-path>
```

Replace `<relative-folder-path>` with the name of the folder containing your JSON files.

#### Example

```
node findFileTypes.js json-files
```

The script will search through all the JSON files in the specified folder for URLs containing the specified file types (like .jpg, .png, .mp4, etc.).

#### Output

The script will output a list of unique file URLs found in the JSON files, along with the total count of unique files.

## Customizing the File Types
The script is configured to search for the following file types by default:

- Images: .jpg, .jpeg, .png, .gif, .webp
- Videos: .mp4, .mov

You can modify the list of file types by editing the fileExtensions array in the `findFileTypes.js` file:


```
const fileExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', // Image formats
    '.mp4', '.mov', // Video formats
];
```

Add or remove file extensions as needed.

#### Example

Assume the json-files folder contains a JSON file `example.json` with the following content:

```
{
  "images": [
    "https://example.com/images/photo1.jpg",
    "https://example.com/images/photo2.png",
    "https://example.com/images/photo1.jpg"
  ],
  "videos": [
    "https://example.com/videos/video1.mp4",
    "https://example.com/videos/video2.mov"
  ]
}
```


#### Running the script will produce:

```
Processing file: /path/to/your/project/json-files/example.json
Found file paths:

/photo1.jpg
/photo2.png
/video1.mp4
/video2.mov

Total unique files found: 4
```