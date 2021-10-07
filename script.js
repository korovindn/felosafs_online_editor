let chooseImage = () => {
    document.getElementById('file').click();
}

let showImage = (fl) => {
    if (fl.files.length > 0) {
        let reader  = new FileReader();

        reader.onload = function (e) {
            let img = new Image();
            img.src = e.target.result; 
            let go = document.getElementById('go')
            go.style.display = "block";
            let crop = new Croppie(document.getElementById('crop-area'), {
                viewport: {
                width: 1000,
                height: 700
                },
                boundary: {
                width: 1000,
                height: 700
            }
            });
            crop.bind({
                url: img.src,
                orientation: 1
            });    
            go.addEventListener('click', function() {
            crop.result('base64').then(saveCrop);
            });
            document.getElementById('myimage').src = reader.result;
            document.getElementById('btChooseImage').style.display = "none"; 
        };
        reader.readAsDataURL(fl.files[0]);
    }
}

let saveCrop = (result) =>{
    document.getElementById('myimage').src = result;
    document.getElementById('editor').style.display = "block";
}

let showOrHide = (cb, cat) => {
    cb = document.getElementById(cb);
    cat = document.getElementById(cat);
    if (cb.checked) cat.style.display = "block";
    else cat.style.display = "none";
}

let textContainer;
let authorContainer;
let t = '';
let a = '';

let writeText = (ele) => {
    t = ele.value;
    document.getElementById('theText').innerHTML = t.replace(/\n\r?/g, '<br />');
}

let writeAuthor = (ele) => {
    a = ele.value;
    console.log(ele.value);
    document.getElementById('theAuthor').innerHTML = a.replace(/\n\r?/g, '<br />');
}

let saveImageWithText = () => { // Maybe it's a piece of shit, never worked with images before. 
                                // And this func must be split I think cause it's too huge.
                                // Someday I'll do it................................I believe.

    textContainer = document.getElementById('theText');
    authorContainer = document.getElementById('theAuthor'); 

    // Create an image object.
    let img = new Image();
    img.src = document.getElementById('myimage').src;
   
    // Create a canvas object.
    let canvas = document.createElement("canvas");
    
    // Wait till the image is loaded.
    img.onload = function(){
        drawImage();
        downloadImage(img.src.replace(/^.*[\\\/]/, ''));    // Download the processed image.
    }
    
    // Draw the image on the canvas.
    let drawImage = () => {
        let ctx = canvas.getContext("2d");	// Create canvas context.

        // Assign width and height (fixed for this example).
        canvas.width = 1000;
        canvas.height = 700;

          // Draw the image.
        ctx.drawImage(img, 0, 0);

        // Put darkener and gradient
        
        ctx.globalCompositeOperation = 'screen';
        let blue = ctx.createLinearGradient(0, 700, 1000, 0);
        blue.addColorStop(0, "rgba(0,72,128)");
        blue.addColorStop(0.5, "black");
        blue.addColorStop(1, "rgba(0,72,128)");
        
        let purple = ctx.createLinearGradient(0, 700, 1000, 0);
        purple.addColorStop(0, "rgba(96,0,72)");
        purple.addColorStop(0.5, "black");
        purple.addColorStop(1, "rgba(96,0,72)");

        let green = ctx.createLinearGradient(0, 700, 1000, 0);
        green.addColorStop(0, "rgba(0,75,0)");
        green.addColorStop(0.5, "black");
        green.addColorStop(1, "rgba(0,75,0)");

        let yellow = ctx.createLinearGradient(0, 700, 1000, 0);
        yellow.addColorStop(0, "rgba(128,72,0)");
        yellow.addColorStop(0.5, "black");
        yellow.addColorStop(1, "rgba(128,72,0)");


        
        blueCb = document.getElementById('blue');
        purpleCb = document.getElementById('purple');
        greenCb = document.getElementById('green');
        yellowCb = document.getElementById('yellow');
        if (blueCb.checked) {
            ctx.fillStyle = blue;
            ctx.fillRect(0, 0, 1000, 700);
        }
        if (purpleCb.checked){
            ctx.fillStyle = purple;
            ctx.fillRect(0, 0, 1000, 700);
        }
        if (greenCb.checked){
            ctx.fillStyle = green;
            ctx.fillRect(0, 0, 1000, 700);
        }
        if (yellowCb.checked){
            ctx.fillStyle = yellow;
            ctx.fillRect(0, 0, 1000, 700);
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.rect(0, 0, 1000, 700);
        ctx.fill();
        
        textContainer.style.border = 0;
        authorContainer.style.border = 0;
        
        // Get position.
        let leftT = 70;
        let paddingLeftT = 5;
        let paddingTopT = 5;
        let topT = parseInt(window.getComputedStyle(textContainer).top, 10);

        let leftA = parseInt(window.getComputedStyle(authorContainer).left, 10);
        let paddingLeftA = 5;
        let paddingTopA = 5;
        let topA = parseInt(window.getComputedStyle(authorContainer).top, 10);

        let xT = leftT+paddingLeftT;
               
        // Assign text properties for Text to the context.
        ctx.font = '600 italic  48px Montserrat';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';

        // Get the text (it can a word or a sentence) to write over the image.
        // let str = t.replace(/\n\r?/g, '<br />').split('<br />');
        // console.log(str)

        let str = []

        for (let i = 0, n = 0; i < t.length; i++) {
            n++;
            console.log(n);
            if(n === 28 || t[i] === /\n\r?/g){
                console.log(t.substr(i-n+1,n))
                console.log(i-n+1, n-1)
                str.push(t.substr(i-n+1,n))
                n = 0
            }
        }

        console.log(str)

        // Finally, draw the text using Canvas fillText() method.
        for (let i = 0; i < str.length; i++) {
            ctx.fillText(
                str[i]
                    .replace('</div>','')
                    .replace('<br>', '')
                    .replace(';',''), 
                xT, 
                parseInt(paddingTopT, 10) + 48 + parseInt(topT, 10) + (i * 58)); // Don't know why I have to add font size, but it works correct...
                                                                                // 58 is line height (48*1.2)
        }
        
        // Change font for Author.
        ctx.font = 'bold  48px Montserrat';

        // Now x for Author.
        let xA = leftA+paddingLeftA;

        // Change the text to write over the image.
        
        str = a.replace(/\n\r?/g, '<br />').split('<br />');

        // Finally, draw the text using Canvas fillText() method again.
        for (let i = 0; i < str.length; i++) {
            ctx.fillText(
                str[i]
                    .replace('</div>','')
                    .replace('<br>', '')
                    .replace(';',''), 
                xA, 
                parseInt(paddingTopA, 10) + 48 + parseInt(topA, 10) + (i * 58));
        }
        // Now draw pseudo elements
        str = "—";
        ctx.fillText(str, xA, parseInt(paddingTopA, 10) + 48 + parseInt(topA, 10)-50)
        str = "“";
        ctx.font = 'bold italic  144px Montserrat';
        ctx.fillText(str, xT-10, parseInt(paddingTopT, 10) + 48 + parseInt(topT, 10)-50);
    }

    // Download the processed image.
    let downloadImage = (img_name) => {
        let a = document.createElement('a');
        a.href = canvas.toDataURL("image/png");
        a.download = img_name;
        document.body.appendChild(a);
        a.click();        
    }  
}
