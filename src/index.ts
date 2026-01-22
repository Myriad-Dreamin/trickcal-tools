const baseUrl = '/trickcal-tools';
const personalityData: Record<string, string[]> = {
    "cool": [
        "皮可菈",
        "艾斯皮",
        "艾琳娜",
        "艾蜜莉雅",
        "希拉",
        "佩佩",
        "帕特拉",
        "芙莉可",
        "梅露娜",
        "傑德",
        "雷吉",
        "綾"
    ],
    "mad": [
        "大師2號",
        "伊弗利特",
        "希瑟圖",
        "貝麗塔",
        "庫洛艾",
        "梅森",
        "莉茲",
        "愛麗絲",
        "蒂亞娜",
        "瑪約",
        "劉美美",
        "謝蒂"
    ],
    "naive": [
        "大木頭",
        "加薇雅",
        "艾爾芬",
        "希菲爾",
        "阿萊特",
        "海莉",
        "馬爾",
        "莎莉",
        "斯皮奇",
        "路易",
        "薇薇"
    ],
    "jolly": [
        "卡蓮",
        "奶油",
        "米雪",
        "羽伊",
        "艾皮卡",
        "桃桃",
        "泰達",
        "班尼",
        "茱蜜",
        "康娜",
        "路德",
        "瑪麗",
        "盧波"
    ],
    "gloomy": [
        "布蘭切",
        "希爾德",
        "貝魯",
        "佩斯塔",
        "柯米",
        "珀榭",
        "基狄恩",
        "琳",
        "萊薇",
        "橋菲",
        "優米",
        "xX錫安Xx"
    ]
};
const crayonMap: Record<string, string[][]> = {
    '攻击力': [
        ['綾', '大木頭', '路易', '艾爾芬', '佩斯塔', '芙莉可', '加薇雅', '茱蜜', '馬爾', '瑪麗', '梅露娜', '桃桃', '米雪', '帕特拉', '謝蒂', '斯皮奇', '希拉', '泰達', '貝魯', '優米', '奶油', '希爾德', '艾琳娜', '莉茲'],
    ],
    '暴击': [
        ['愛麗絲', '阿萊特', '貝麗塔', '班尼', '卡蓮', '庫洛艾', '蒂亞娜', '艾斯皮', '萊薇', '大師2號', '梅森', '琳', '路德', '盧波', '莎莉', '希菲爾', '希瑟圖', '羽伊', '佩佩', '薇薇', '劉美美', '艾皮卡', '布蘭切'],
    ],
    'HP': [
        ['愛麗絲', '貝麗塔', '班尼', '大木頭', '庫洛艾', '路易', '芙莉可', '加薇雅', '大師2號', '馬爾', '瑪麗', '梅露娜', '桃桃', '米雪', '路德', '莎莉', '希菲爾', '希拉', '泰達', '薇薇', '劉美美', '希爾德', '莉茲', '布蘭切'],
    ],
    '暴击抵抗': [
        ['阿萊特', '艾蜜莉雅', '康娜', '卡蓮', '橋菲', '蒂亞娜', '艾斯皮', '海莉', '伊弗利特', '傑德', '基狄恩', '柯米', '雷吉', '萊薇', '梅森', '瑪約', '皮可菈', '珀榭', '琳', '盧波', '希瑟圖', '羽伊', '佩佩', 'xX錫安Xx', '艾皮卡'],
    ],
    '防御力': [
        ['艾蜜莉雅', '綾', '康娜', '橋菲', '艾爾芬', '佩斯塔', '海莉', '伊弗利特', '傑德', '茱蜜', '基狄恩', '柯米', '雷吉', '瑪約', '帕特拉', '皮可菈', '珀榭', '謝蒂', '斯皮奇', '貝魯', 'xX錫安Xx', '優米', '奶油', '艾琳娜'],
    ],
}
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
const tab2Map = new Map<string, Set<string>>();
tab2Map.set('owned', ownedMap);
tab2Map.set('attack', attackMap);
tab2Map.set('crit', critMap);
tab2Map.set('hp', hpMap);
tab2Map.set('crit-resist', critResistMap);
tab2Map.set('defense', defenseMap);
const saveData = (data: Record<string, string[]> | undefined = undefined) => {
    for (const [key, map] of (data === undefined ? tab2Map.entries() : Object.entries(data))) {
        localStorage.setItem(key, JSON.stringify(Array.from(map)));
    }
}
const loadData = () => {
    console.log('loadData');
    for (const [key, map] of tab2Map.entries()) {
        const data = localStorage.getItem(key);
        if (data) {
            map.clear();
            for (const item of JSON.parse(data)) {
                map.add(item);
            }
        }
    }
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
        const humanReadable = humanReadableMap[key as keyof typeof humanReadableMap];
        const item = summaryTable!.appendChild(document.createElement('div'));
        item.className = `summary-table-item summary-table-item-${key}`;
        const itemLabel = item.appendChild(document.createElement('div'));
        itemLabel.className = 'summary-table-item-label';
        itemLabel.textContent = `${humanReadable}`;
        const itemValue = item.appendChild(document.createElement('div'));
        itemValue.className = 'summary-table-item-value';
        itemValue.textContent = `${map.size * 3}%`;
    }

    for (const key of ['attack', 'crit', 'hp', 'crit-resist', 'defense']) {
        const map = tab2Map.get(key)!;
        const humanReadable = humanReadableMap[key as keyof typeof humanReadableMap];
        const item = summaryTable!.appendChild(document.createElement('div'));
        item.className = `summary-table-item summary-table-item-${key}`;
        const itemLabel = item.appendChild(document.createElement('div'));
        itemLabel.className = 'summary-table-item-label';
        itemLabel.textContent = `${humanReadable}（1层）`;
        const itemValue = item.appendChild(document.createElement('div'));
        itemValue.className = 'summary-table-item-value';
        itemValue.textContent = `${map.size} / ${crayonMap[humanReadable][0].length}`;
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
crayonTableSwitchItems.forEach(item => {
    const key = item.id.split('-')[3];
    let selectedCharacters = characters;
    let feature = allFeature;
    if (key === 'attack') {
        selectedCharacters = crayonMap['攻击力'].flat();
        feature = crayonFeature('attack');
    } else if (key === 'crit') {
        selectedCharacters = crayonMap['暴击'].flat();
        feature = crayonFeature('crit');
    } else if (key === 'hp') {
        selectedCharacters = crayonMap['HP'].flat();
        feature = crayonFeature('hp');
    } else if (key === 'crit-resist') {
        selectedCharacters = crayonMap['暴击抵抗'].flat();
        feature = crayonFeature('crit-resist');
    } else if (key === 'defense') {
        selectedCharacters = crayonMap['防御力'].flat();
        feature = crayonFeature('defense');
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
    });
});