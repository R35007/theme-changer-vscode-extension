let colors = [];
const vscode = acquireVsCodeApi();

const vsCodeMessageReceiveHandler = () => {
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const data = event.data; // The json data that the extension sent
        switch (data.type) {
            case 'addColor':
                addColor();
                break;
            case 'clearColors':
                clearColors();
                break;
            case 'updateColors':
                updateColorsList(data.colors);
                break;

        }
    });
}

const randomColor = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return ('#' + n.slice(0, 6)).toUpperCase();
};

const getColorNode = (color, index) => {
    return (`
    <li class="color-entry">
        <input id="color-picker-${index}" type="color" class="color-picker h-100" value="${color}" data-index="${index}">
        <input id="color-input-${index}" type="text" class="color-input" value="${color}" data-index="${index}">
        <button id="color-select-btn-${index}" class="color-select-btn" data-index="${index}">Select</button>
        <button id="color-remove-btn-${index}" class="color-remove-btn" data-index="${index}">x</button>
    </li>
`)
}

const updateColorsList = (colors) => {
    const ul = document.getElementById("color-list");
    const colorsList = colors.map(getColorNode)
    ul.innerHTML = colorsList.join('');


    // on Color picker color change handler
    document.querySelectorAll(".color-picker").forEach(item => {
        item.addEventListener('change', event => {
            const value = event?.target?.value?.toUpperCase();
            const index = event?.target?.dataset?.index;
            updateColor(index, value);
        })
    })

    // On Color input change handler
    document.querySelectorAll(".color-input").forEach(item => {
        item.addEventListener('change', event => {
            const value = event?.target?.value?.toUpperCase();
            const index = event?.target?.dataset?.index;
            if (!value?.length) return removeColor(index);
            updateColor(index, value);
        })
    })


    // on Color select button click Handler
    document.querySelectorAll(".color-select-btn").forEach(item => {
        item.addEventListener('click', event => selectColor(event?.target?.dataset?.index))
    })

    // on Color remove button click Handler
    document.querySelectorAll(".color-remove-btn").forEach(item => {
        item.addEventListener('click', event => removeColor(event?.target?.dataset?.index))
    })

    // On Add Color Button Click handler
    document.getElementById('add-color-button').addEventListener('click', addColor);

    // On Set as Global Theme Checkbox check
    document.getElementById('set-as-global-theme').addEventListener('change', function () { setAsGlobalTheme(this.checked) });

}

// Set as Global Theme
const setAsGlobalTheme = (isGlobalTheme) => {
    vscode.postMessage({ type: 'set-as-global-theme', value: isGlobalTheme });
}

// Clear All Colors
const clearColors = () => {
    while (colors.length) {
        colors.pop()
    }
    updateColorsList(colors);
    vscode.postMessage({ type: 'colors-list-update', value: colors });
}

// Remove Specific Color by Index
const removeColor = (index) => {
    colors.splice(index, 1);
    updateColorsList(colors);
    vscode.postMessage({ type: 'colors-list-update', value: colors });
}

// Update a Specific Color by Index
const updateColor = (index, value) => {
    colors[index] = value;
    updateColorsList(colors);
    vscode.postMessage({ type: 'colors-list-update', value: colors });
}

// Select Color
const selectColor = (index) => {
    vscode.postMessage({ type: 'colorSelected', value: colors[index] });
}


// Add a Random Color
const addColor = () => {
    const newColor = randomColor();
    colors.push(newColor);
    updateColorsList(colors);
    vscode.postMessage({ type: 'colors-list-update', value: colors });
}

const init = (_colors) => {
    colors = _colors;
    vsCodeMessageReceiveHandler();
    updateColorsList(colors);
}