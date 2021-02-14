
export function loadAssets(
    textFiles: { name: string, path: string, content: string }[],
    models: { name: string, path: string, content: Document }[],
    images: { name: string, path: string, content: HTMLImageElement }[],
    finishedCallback: () => void)
{
    let amountToLoad = textFiles.length + models.length + images.length;

    for (let i = 0; i < textFiles.length; i++)
    {
        loadFile(textFiles[i].path, true,
            (src) => { textFiles[i].content = src as string; areLoaded(); });
    }

    for (let i = 0; i < models.length; i++)
    {
        loadFile(models[i].path, false,
            (src) => { models[i].content = src as Document; areLoaded(); });
    }

    for (let i = 0; i < images.length; i++)
    {
        loadImage(images[i].path,
            (image) => { images[i].content = image; areLoaded(); });
    }

    function areLoaded()
    {
        amountToLoad--;
        if (amountToLoad === 0)
        {
            finishedCallback();
        }
    }
}

export function loadImage(path, callback: (img: HTMLImageElement) => void)
{
    const image = new Image();
    image.onload = () => { callback(image) };
    image.src = path;
}

export function loadFile(path: string, isTextFile: boolean, callback: (content: string | Document) => void)
{
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () =>
    {
        if (xhr.readyState === 4 && xhr.status !== 404)
        {
            if (isTextFile)
            {
                callback(xhr.responseText);
            }
            else
            {
                callback(xhr.responseXML);
            }
        }
    };

    xhr.open("GET", path, true);
    xhr.send();
}
