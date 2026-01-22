import path from "path";
import fs from "fs";

const characters = [
    '皮可菈',
    '艾斯皮',
    '艾琳娜',
    '艾蜜莉雅',
    '希拉',
    '佩佩',
    '帕特拉',
    '芙莉可',
    '梅露娜',
    '傑德',
    '雷吉',
    '綾',
    '大師2號',
    '伊弗利特',
    '希瑟圖',
    '貝麗塔',
    '庫洛艾',
    '梅森',
    '莉茲',
    '愛麗絲',
    '蒂亞娜',
    '瑪約',
    '劉美美',
    '謝蒂',
    '大木頭',
    '加薇雅',
    '艾爾芬',
    '希菲爾',
    '阿萊特',
    '海莉',
    '馬爾',
    '莎莉',
    '斯皮奇',
    '路易',
    '薇薇',
    '卡蓮',
    '奶油',
    '米雪',
    '羽伊',
    '艾皮卡',
    '桃桃',
    '泰達',
    '班尼',
    '茱蜜',
    '康娜',
    '路德',
    '瑪麗',
    '盧波',
    '布蘭切',
    '希爾德',
    '貝魯',
    '佩斯塔',
    '柯米',
    '珀榭',
    '基狄恩',
    '琳',
    '萊薇',
    '橋菲',
    '優米',
    'xX錫安Xx'
];

// $$('.board-grid img').filter(it => it.getAttribute('src').startsWith('/assets/characters/')).map(it => it.getAttribute('src').split('/').pop()?.replace('.webp', ''))
async function renameIt() {
    // downloads to /public/assets/characters/
    const dir = path.join(import.meta.dirname, '..', 'public', 'assets', 'characters');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    // E4_BC_8A_E5_BC_97_E5_88_A9_E7_89_B9.webp
    for (const character of characters) {
        const encoded = encodeURIComponent(character).replace(/^%/g, '').replace(/\%/g, '_');
        const oldName = `public/assets/characters1/${encoded}.webp`;
        const newName = `public/assets/characters/${character}.webp`;
        fs.renameSync(oldName, newName);
    }
}

// find all img src which has parent: div.food-character-card.personality-..
// const personality = ['cool', 'mad', 'naive', 'jolly', 'gloomy'];
// const personalityMap = {};
// for (const p of personality) {
//     const characterNames = $$(`div.food-character-card.personality-${p}`).map(
//         it => decodeURIComponent(it.querySelector('img')?.src || '').split('/').pop()?.replace('.webp', ''));
//     personalityMap[p] = characterNames;
// }
// console.log(personalityMap);

// renameIt()
// renameIt()