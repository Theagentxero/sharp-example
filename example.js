

/*  This example will be broken into four parts:
    -----------------------------------------------
        [1] - The Simplest Possible Example
        [2] - A Pair Of Examples That Describe The Sharp Entropy Options (This is where we talk about the two types of entropy that Sharp supports)
        [3] - Input Methods
        [4] - Notes and Lessons Hard Learned
*/

// Libraries (These Are Required For All Examples)
// File System - Built Into Node.js
const fs = require('fs');
// Sharp - The Image Manipulation Library We Will Be Using
// https://sharp.pixelplumbing.com/
const sharp = require('sharp'); // Install Using `npm install sharp`


// The Simplest Possible Example
function simpleExample(){
    // We need to describe to Sharp how we want the image processed, this is done via the Options object
    // The options object will be covered in detail in section 2
    var options = {
        width: 256,
        height: 256,
        fit: 'cover',
        position: sharp.strategy.entropy
    };
    // Sharp is functional and asyncronous, so the call structure might look strange if you arent used to it
    sharp("input.png").resize(options).jpeg().toFile("simple.jpg");
    /*
        Breakdown of this call:
        -------------------------
            sharp("input.jpg")      // Calls Sharp and provides a file path input (Sharp also accepts buffers, which we will cover in section 3)
            .resize(options)        // Requests that the image provided be resized utilizing the options in the options object
            .jpeg()                 // Requests the resized image be transformed to a jpeg
            .toFile("simple.jpg")   // Requests that Sharp writes the jpeg image to the file "simple.jpg" in the current working directory
    */
}


/*
    After running this script, you might notice something about simple.jpg,
    The subject Ralph, who is to the left of the frame in the input.png image is cropped and cented in the ouput.

    But how does Sharp determine the location of the subject in an image? The answer is entropy. 
    See: https://en.wikipedia.org/wiki/Entropy_%28information_theory%29

    In our simple example, we asked Sharp to use a very vanilla Shannon Entropy, but Sharp also supports a 
    homebrewed entropy method that they call "attention", which places a higher value on skin tones and color saturation.

    The difference between these two methods can be subtle, but lets take a look at an example where the difference is pretty big
*/ 

function exampleWithBothTypesOfEntropy(){
    // Here we are using input-entropy-difference.jpg as the input file

    // This first option set will use Sharp's vanilla entropy function, and will output to entropy-test-shannon.jpg
    var optionsShannon = {
        width: 256,
        height: 256,
        fit: 'cover',
        position: sharp.strategy.entropy // The position key determines what strategy will be used
    };
    sharp("input-entropy-difference.jpg").resize(optionsShannon).jpeg().toFile("entropy-test-shannon.jpg");
    // The second option set will use Sharp's "attention" modified entropy function, and will output to entropy-test-attention.jpg
    var optionsAttention = {
        width: 256,
        height: 256,
        fit: 'cover',
        position: sharp.strategy.attention 
    };
    sharp("input-entropy-difference.jpg").resize(optionsAttention).jpeg().toFile("entropy-test-attention.jpg");
}

// You'll notice that the attention model is placing a higher value on the skin tones and the color saturation of the biker than the shannon model.
// This might be useful to you, lets talk about the other options
/*
    Options Object Keys:
        width - ouput width of the image
        height - ouput height of the image
        fit - How the image should be fitted, in the entropy application, we should always be using "cover"
        position - describes how the image should be situated when the thumbnail is taken, we have covered all the available options for this
*/

// Input Methods
// Sharp supports input as either a file path string, or a buffer, nearly any type of buffer is supported

function bufferExample(){
    // Here we will read from the file system, however your buffer could come from anywhere
    fs.readFile("input.png", (err, data)=>{
        // if an error exists while reading this file, it will be in `err`
        if(err){
            throw err;
        }
        
        // otherwise the file is now a buffer in `data`
        
        // Same options as in the simple example
        var options = {
            width: 256,
            height: 256,
            fit: 'cover',
            position: sharp.strategy.entropy
        };
        sharp(data).resize(options).jpeg().toFile("fromBuffer.jpg");

        // You can also receive the result as a buffer from Sharp, available in either callback or promise, I'll use a promise here
        var bufferPromise = sharp(data).resize(options).jpeg().toBuffer()
        bufferPromise.then((data)=>{
            // if everything goes well, our buffer is in `data`
            console.log(`Sharp Gave Us A Buffer`)
        })
        .catch((err)=>{
            // If something goes wrong, this runs
            console.log(`An Error Occured During The Transformation From Buffer To Buffer`)
            console.log(err);
        })
    })
}

// Notes and Lessons Learned
/* 
    Sharp will let you output in a bunch of different formats, ( replace the chained call `.jpeg()` with something like `.png()` for a png or `.webp()` for webp) 
    You might want to utilize webp if you are targeting web outputs, bare in mind that these will not work for Internet Explorer clients

    Sharp will NOT pass metadata from the original image onto the resized image, but you can request that metadata is passed by chaining the function `.withMetadata()` into the Sharp call
*/


// Run the simple example
simpleExample();
// Run the entropy types example
exampleWithBothTypesOfEntropy();
// Run the Buffer input and output example
bufferExample();