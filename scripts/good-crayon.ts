import { personalityData, crayonMap } from '../src/data.ts';

// 同时包含 攻击力、HP、防御力的二层角色
const attack2 = crayonMap['攻击力'][2];
const hp2 = crayonMap['HP'][2];
const defense2 = crayonMap['防御力'][2];

// contribution
const contributions: string[][] = [[], [], [], [], []];

const personalities = Object.keys(personalityData);
const characters = personalities.flatMap(p => personalityData[p]);
for (const name of characters) {
    let included = 0;
    if (attack2.includes(name)) {
        included++;
    }
    if (hp2.includes(name)) {
        included++;
    }
    if (defense2.includes(name)) {
        included++;
    }
    contributions[included].push(name);
}
for (const contribution of contributions) {
    console.log(contribution.join('，'));
    console.log('--------------------------------');
}