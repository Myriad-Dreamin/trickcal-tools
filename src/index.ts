import { baseUrl, personalityData, crayonMap } from './data';
const personalities = Object.keys(personalityData);
const characters = personalities.flatMap(p => personalityData[p]);
const characterMap = new Map<string, Character>();
for (const [personality, characters] of Object.entries(personalityData)) {
    for (const character of characters) {
        characterMap.set(character, {
            name: character,
            image: `${baseUrl}/assets/characters/${character}.webp`,
            personality: personality,
        });
    }
}
const ownedMap = new Set<string>();
const attackMap = new Set<string>();
const critMap = new Set<string>();
const hpMap = new Set<string>();
const critResistMap = new Set<string>();
const defenseMap = new Set<string>();
const attack2Map = new Set<string>();
const crit2Map = new Set<string>();
const hp2Map = new Set<string>();
const critResist2Map = new Set<string>();
const defense2Map = new Set<string>();
const attack3Map = new Set<string>();
const crit3Map = new Set<string>();
const hp3Map = new Set<string>();
const critResist3Map = new Set<string>();
const defense3Map = new Set<string>();
const tab2Map = new Map<string, Set<string>>();
tab2Map.set('owned', ownedMap);
tab2Map.set('attack', attackMap);
tab2Map.set('crit', critMap);
tab2Map.set('hp', hpMap);
tab2Map.set('crit-resist', critResistMap);
tab2Map.set('defense', defenseMap);
tab2Map.set('attack2', attack2Map);
tab2Map.set('crit2', crit2Map);
tab2Map.set('hp2', hp2Map);
tab2Map.set('crit-resist2', critResist2Map);
tab2Map.set('defense2', defense2Map);
tab2Map.set('attack3', attack3Map);
tab2Map.set('crit3', crit3Map);
tab2Map.set('hp3', hp3Map);
tab2Map.set('crit-resist3', critResist3Map);
tab2Map.set('defense3', defense3Map);
const saveData = (data: Record<string, string[]> | undefined = undefined) => {
    for (const [key, map] of (data === undefined ? tab2Map.entries() : Object.entries(data))) {
        localStorage.setItem(key, JSON.stringify(Array.from(map)));
    }
}
const loadData = () => {
    let loaded: Record<string, any> = {};
    for (const [key, map] of tab2Map.entries()) {
        const data = localStorage.getItem(key);
        loaded[key] = data;
        if (data) {
            map.clear();
            for (const item of JSON.parse(data)) {
                map.add(item);
            }
        }
    }
    console.log('loadData', loaded);
}
const summaryTableActionImport = document.getElementById('summary-table-action-import');
const summaryTableActionExport = document.getElementById('summary-table-action-export');
summaryTableActionImport!.addEventListener('click', () => {
    const bytes2utf8 = new TextDecoder("utf-8");
    const base64DecodeToBytes = (encoded: string) =>
        Uint8Array.from(atob(encoded), (m) => m.charCodeAt(0));
    const base64Decode = (encoded: string) => bytes2utf8.decode(base64DecodeToBytes(encoded));
    const tryParse = (encoded: string) => {
        try {
            const data = JSON.parse(base64Decode(encoded));
            if (typeof data !== 'object' || data === null) {
                return '数据格式错误';
            }
            return '';
        } catch (error) {
            return '请输入有效的数据（需要Base64编码的JSON数据）';
        }
    };

    // show input textarea dialog
    const textarea = document.createElement('textarea');
    textarea.id = 'summary-table-action-import-textarea';
    textarea.value = localStorage.getItem('summary-table') || '';
    textarea.focus();
    textarea.addEventListener('blur', () => {
        localStorage.setItem('summary-table', textarea.value);
    });
    textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            localStorage.setItem('summary-table', textarea.value);
        }
    });
    // validation: must be a valid JSON
    const errorMessage = document.createElement('div');
    errorMessage.className = 'dialog-error-message';
    errorMessage.textContent = '';
    textarea.addEventListener('input', () => {
        const error = tryParse(textarea.value);
        errorMessage.textContent = error;
    });
    const saveDataButton = document.createElement('button');
    saveDataButton.className = 'dialog-button';
    saveDataButton.textContent = '保存';
    // float above and add close button
    const dialog = document.createElement('div');
    dialog.className = 'dialog';
    const dialogContent = document.createElement('div');
    dialogContent.className = 'dialog-content';
    dialogContent.appendChild(saveDataButton);
    dialogContent.appendChild(errorMessage);
    dialogContent.appendChild(textarea);
    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);

    saveDataButton.addEventListener('click', () => {
        const error = tryParse(textarea.value);
        errorMessage.textContent = error;
        if (error === '') {
            saveData(JSON.parse(base64Decode(textarea.value)));
            console.log('imported', JSON.parse(base64Decode(textarea.value)));
            window.location.reload();
            document.body.removeChild(dialog);
            return;
        }
    });
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            document.body.removeChild(dialog);
        }
    });
});
summaryTableActionExport!.addEventListener('click', () => {
    const bytesBase64Encode = (bytes: Uint8Array) =>
        btoa(Array.from(bytes, (c) => String.fromCharCode(c)).join(""));
    const data = {
        owned: Array.from(ownedMap),
        attack: Array.from(attackMap),
        crit: Array.from(critMap),
        hp: Array.from(hpMap),
        'crit-resist': Array.from(critResistMap),
        defense: Array.from(defenseMap),
        attack2: Array.from(attack2Map),
        crit2: Array.from(crit2Map),
        hp2: Array.from(hp2Map),
        'crit-resist2': Array.from(critResist2Map),
        defense2: Array.from(defense2Map),
        attack3: Array.from(attack3Map),
        crit3: Array.from(crit3Map),
        hp3: Array.from(hp3Map),
        'crit-resist3': Array.from(critResist3Map),
        defense3: Array.from(defense3Map),
    };
    console.log('exported', data);
    navigator.clipboard.writeText(bytesBase64Encode(new TextEncoder().encode(JSON.stringify(data))));
    // show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'dialog-message';
    successMessage.textContent = '已复制到剪贴板';
    document.body.appendChild(successMessage);
    setTimeout(() => {
        document.body.removeChild(successMessage);
    }, 2000);
});

const onUpdate = () => {
    updateSummary();
    saveData();
}

loadData();

interface Character {
    name: string;
    image: string;
    personality: string;
}

let currentTab = 'all';
const createCharactersTable = (characters: Character[], features: (it: string) => string = it => '') => {
    const table = document.createElement('div');
    table.className = 'characters';
    for (const character of characters) {
        const div = document.createElement('div');
        div.className = `characters-item personality-${character.personality} ${features(character.name)}`;
        const img = document.createElement('img');
        img.className = 'characters-item-img';
        img.src = character.image;
        img.alt = character.name;
        div.appendChild(img);
        table.appendChild(div);
        div.addEventListener('click', () => {
            if (currentTab === 'all') {
                if (ownedMap.has(character.name)) {
                    ownedMap.delete(character.name);
                    div.classList.remove('owned');
                } else {
                    ownedMap.add(character.name);
                    div.classList.add('owned');
                }
            } else {
                // check if owned
                if (!ownedMap.has(character.name)) {
                    ownedMap.add(character.name);
                    div.classList.add('owned');
                    return;
                }
                const map = tab2Map.get(currentTab)!;
                if (map.has(character.name)) {
                    map.delete(character.name);
                    div.classList.remove('activated');
                } else {
                    map.add(character.name);
                    div.classList.add('activated');
                }
            }
            onUpdate();
        });
    }

    return table;
}

const allFeature = (it: string): string => {
    // whether unlocked
    if (ownedMap.has(it)) {
        return 'owned';
    }
    return '';
};

const crayonFeature = (feature: string) => {
    return (it: string) => {
        const features = [];
        if (ownedMap.has(it)) {
            features.push('owned');
        }
        if (tab2Map.get(feature)!.has(it)) {
            features.push('activated');
        }
        return features.join(' ');
    }
}

function updateSummary() {
    const summaryTable = document.getElementById('summary-table-content');
    summaryTable!.innerHTML = '';

    {
        const unlockItem = summaryTable!.appendChild(document.createElement('div'));
        unlockItem.className = 'summary-table-item summary-table-item-unlock';
        const unlockItemLabel = unlockItem.appendChild(document.createElement('div'));
        unlockItemLabel.className = 'summary-table-item-label';
        unlockItemLabel.textContent = '解锁图鉴';
        const unlockItemValue = unlockItem.appendChild(document.createElement('div'));
        unlockItemValue.className = 'summary-table-item-value';
        unlockItemValue.textContent = `${ownedMap.size} / ${characters.length}`;
    }

    const humanReadableMap = {
        attack: '攻击力',
        crit: '暴击',
        hp: 'HP',
        'crit-resist': '暴击抵抗',
        defense: '防御力',
    }

    for (const key of ['attack', 'crit', 'hp', 'crit-resist', 'defense']) {
        const map = tab2Map.get(key)!;
        const map2 = tab2Map.get(`${key}2`)!;
        const map3 = tab2Map.get(`${key}3`)!;
        const humanReadable = humanReadableMap[key as keyof typeof humanReadableMap];
        const item = summaryTable!.appendChild(document.createElement('div'));
        item.className = `summary-table-item summary-table-item-${key}`;
        const itemLabel = item.appendChild(document.createElement('div'));
        itemLabel.className = 'summary-table-item-label';
        itemLabel.textContent = `${humanReadable}`;
        const itemValue = item.appendChild(document.createElement('div'));
        itemValue.className = 'summary-table-item-value';
        itemValue.textContent = `${(map.size * 3 + map2.size * 4 + map3.size * 5)}%`;
    }

    for (const key of ['attack', 'crit', 'hp', 'crit-resist', 'defense']) {
        const map = tab2Map.get(key)!;
        const map2 = tab2Map.get(`${key}2`)!;
        const map3 = tab2Map.get(`${key}3`)!;

        const humanReadable = humanReadableMap[key as keyof typeof humanReadableMap];
        const item = summaryTable!.appendChild(document.createElement('div'));
        item.className = `summary-table-item summary-table-item-${key}`;
        const itemLabel = item.appendChild(document.createElement('div'));
        itemLabel.className = 'summary-table-item-label';
        itemLabel.textContent = `${humanReadable}（1层）`;
        const itemValue = item.appendChild(document.createElement('div'));
        itemValue.className = 'summary-table-item-value';
        itemValue.textContent = `${map.size} / ${crayonMap[humanReadable][0].length}`;

        const item2 = summaryTable!.appendChild(document.createElement('div'));
        item2.className = `summary-table-item summary-table-item-${key}2`;
        const item2Label = item2.appendChild(document.createElement('div'));
        item2Label.className = 'summary-table-item-label';
        item2Label.textContent = `${humanReadable}（2层）`;
        const item2Value = item2.appendChild(document.createElement('div'));
        item2Value.className = 'summary-table-item-value';
        item2Value.textContent = `${map2.size} / ${crayonMap[humanReadable][1].length}`;

        const item3 = summaryTable!.appendChild(document.createElement('div'));
        item3.className = `summary-table-item summary-table-item-${key}3`;
        const item3Label = item3.appendChild(document.createElement('div'));
        item3Label.className = 'summary-table-item-label';
        item3Label.textContent = `${humanReadable}（3层）`;
        const item3Value = item3.appendChild(document.createElement('div'));
        item3Value.className = 'summary-table-item-value';
        item3Value.textContent = `${map3.size} / ${crayonMap[humanReadable][2].length}`;
    }
}

// 默认显示所有
currentTab = 'all';
const crayonTableContent = document.getElementById('crayon-table-content');
crayonTableContent!.appendChild(createCharactersTable(characters.map(c => characterMap.get(c)!), allFeature));

updateSummary();

// crayon-table-switch
const crayonTableSwitch = document.getElementById('crayon-table-switch');
const crayonTableSwitchItems = crayonTableSwitch!.querySelectorAll('.board-pagination-item');
const summaryTableActionLayer1 = document.getElementById('summary-table-action-layer1');
const summaryTableActionLayer2 = document.getElementById('summary-table-action-layer2');
const summaryTableActionLayer3 = document.getElementById('summary-table-action-layer3');
crayonTableSwitchItems.forEach(item => {
    const key = item.id.split('-')[3];
    let selectedCharacters = characters;
    let selected2Characters = characters;
    let selected3Characters = characters;
    let feature = allFeature;
    let feature2 = allFeature;
    let feature3 = allFeature;
    if (key === 'attack') {
        selectedCharacters = crayonMap['攻击力'][0];
        selected2Characters = crayonMap['攻击力'][1];
        selected3Characters = crayonMap['攻击力'][2];
        feature = crayonFeature('attack');
        feature2 = crayonFeature('attack2');
        feature3 = crayonFeature('attack3');
    } else if (key === 'crit') {
        selectedCharacters = crayonMap['暴击'][0];
        selected2Characters = crayonMap['暴击'][1];
        selected3Characters = crayonMap['暴击'][2];
        feature = crayonFeature('crit');
        feature2 = crayonFeature('crit2');
    } else if (key === 'hp') {
        selectedCharacters = crayonMap['HP'][0];
        selected2Characters = crayonMap['HP'][1];
        selected3Characters = crayonMap['HP'][2];
        feature = crayonFeature('hp');
        feature2 = crayonFeature('hp2');
    } else if (key === 'crit-resist') {
        selectedCharacters = crayonMap['暴击抵抗'][0];
        selected2Characters = crayonMap['暴击抵抗'][1];
        selected3Characters = crayonMap['暴击抵抗'][2];
        feature = crayonFeature('crit-resist');
        feature2 = crayonFeature('crit-resist2');
        feature3 = crayonFeature('crit-resist3');
    } else if (key === 'defense') {
        selectedCharacters = crayonMap['防御力'][0];
        selected2Characters = crayonMap['防御力'][1];
        selected3Characters = crayonMap['防御力'][2];
        feature = crayonFeature('defense');
        feature2 = crayonFeature('defense2');
        feature3 = crayonFeature('defense3');
    } else if (key === 'all') {
        selectedCharacters = characters;
        feature = allFeature;
    } else {
        throw new Error(`Invalid key: ${key}`);
    }
    item.addEventListener('click', () => {
        if (item.classList.contains('active')) return;
        currentTab = key;
        crayonTableSwitchItems.forEach(it => it.classList.remove('active'));
        item.classList.add('active');
        crayonTableContent!.innerHTML = '';
        crayonTableContent!.appendChild(createCharactersTable(selectedCharacters.map(c => characterMap.get(c)!), feature));

        if (['attack', 'crit', 'hp', 'crit-resist', 'defense'].includes(key)) {
            summaryTableActionLayer1!.classList.add('active');
            summaryTableActionLayer2!.classList.remove('active');
            summaryTableActionLayer3!.classList.remove('active');

            summaryTableActionLayer1!.addEventListener('click', () => {
                summaryTableActionLayer1!.classList.add('active');
                summaryTableActionLayer2!.classList.remove('active');
                summaryTableActionLayer3!.classList.remove('active');
                currentTab = 'all';
                crayonTableContent!.innerHTML = '';
                crayonTableContent!.appendChild(createCharactersTable(selectedCharacters.map(c => characterMap.get(c)!), feature));
            });
            summaryTableActionLayer2!.addEventListener('click', () => {
                summaryTableActionLayer1!.classList.remove('active');
                summaryTableActionLayer2!.classList.add('active');
                summaryTableActionLayer3!.classList.remove('active');
                currentTab = 'all';
                crayonTableContent!.innerHTML = '';
                crayonTableContent!.appendChild(createCharactersTable(selected2Characters.map(c => characterMap.get(c)!), feature2));
            });
            summaryTableActionLayer3!.addEventListener('click', () => {
                summaryTableActionLayer1!.classList.remove('active');
                summaryTableActionLayer2!.classList.remove('active');
                summaryTableActionLayer3!.classList.add('active');
                currentTab = 'all';
                crayonTableContent!.innerHTML = '';
                crayonTableContent!.appendChild(createCharactersTable(selected3Characters.map(c => characterMap.get(c)!), feature3));
            });
        } else {
            summaryTableActionLayer1!.classList.remove('active');
            summaryTableActionLayer2!.classList.remove('active');
            summaryTableActionLayer3!.classList.remove('active');
        }
    });
});