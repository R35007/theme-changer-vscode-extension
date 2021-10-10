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
        <vscode-text-field id="color-input-${index}" class="flex-1 color-input" value="${color}" data-index="${index}"></vscode-text-field>
        <vscode-button id="color-remove-btn-${index}" appearance="secondary" class="color-remove-btn" data-index="${index}">x</vscode-button>
        <vscode-button id="color-select-btn-${index}" appearance="primary" class="color-select-btn" data-index="${index}">Select</vscode-button>
    </li>
`)
}

const updateColorsList = (colors) => {
    const ul = document.getElementById("color-list");
    const colorsList = colors.map(getColorNode)
    ul.innerHTML = colorsList.join('');
    addEventListeners();
}

const addEventListeners = () => {
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
    document.getElementById('color-add-btn').addEventListener('click', addColor);

    // On Set as User Theme Checkbox check
    document.getElementById('user-theme-checkbox').addEventListener('change', function () { setAsUserTheme(this.checked) });

    // Reset to Vscode Default Theme - Clears all generated theme colors
    document.getElementById('reset-link').addEventListener('click', function (event) {
        event.preventDefault();
        resetTheme()
    });
}

// Clear all generated Theme Colors
const resetTheme = () => {
    console.log("Reset Theme clicked");
    vscode.postMessage({ type: 'reset-theme' });
}

// Set as User Theme
const setAsUserTheme = (isUserTheme) => {
    vscode.postMessage({ type: 'is-user-theme', value: isUserTheme });
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