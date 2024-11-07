export const calculateStat1 = (base, skill, equipment, job) => {
    return (base * (1 + 0.01 * (skill + equipment + job))).toFixed(0);
};

export const calculateStat2 = (base, skill, equipment, job) => {
    return (base + skill + equipment + job).toFixed(0);
};

export const additionalCalculateStat = (skill, equipment, job) => {
    return (skill + equipment + job).toFixed(0);
};

export const calculateUserStats = (userData) => {
    if (!userData) return {};

    const { baseStats, skillStats, equipmentStats, jobStats } = userData.combat;

    const HP = calculateStat1(baseStats.HP, skillStats.HP, equipmentStats.HP, jobStats.HP);
    const PA = calculateStat1(baseStats.PA, skillStats.PA, equipmentStats.PA, jobStats.PA);
    const MA = calculateStat1(baseStats.MA, skillStats.MA, equipmentStats.MA, jobStats.MA);
    const PD = calculateStat2(baseStats.PD, skillStats.PD, equipmentStats.PD, jobStats.PD);
    const MD = calculateStat2(baseStats.MD, skillStats.MD, equipmentStats.MD, jobStats.MD);
    const CT = calculateStat2(baseStats.CT, skillStats.CT, equipmentStats.CT, jobStats.CT);
    const CD = calculateStat2(baseStats.CD, skillStats.CD, equipmentStats.CD, jobStats.CD);
    const AV = calculateStat2(baseStats.AV, skillStats.AV, equipmentStats.AV, jobStats.AV);
    const AR = calculateStat2(baseStats.AR, skillStats.AR, equipmentStats.AR, jobStats.AR);
    const DLY = ((1000 - 50 * Math.pow(userData.userStats.dexterity, 0.3)) * (1 - AR / 100)).toFixed(0);

    const effectHP = additionalCalculateStat(skillStats.HP, equipmentStats.HP, jobStats.HP);
    const effectPA = additionalCalculateStat(skillStats.PA, equipmentStats.PA, jobStats.PA);
    const effectMA = additionalCalculateStat(skillStats.MA, equipmentStats.MA, jobStats.MA);
    const effectPD = additionalCalculateStat(skillStats.PD, equipmentStats.PD, jobStats.PD);
    const effectMD = additionalCalculateStat(skillStats.MD, equipmentStats.MD, jobStats.MD);
    const effectCT = additionalCalculateStat(skillStats.CT, equipmentStats.CT, jobStats.CT);
    const effectCD = additionalCalculateStat(skillStats.CD, equipmentStats.CD, jobStats.CD);
    const effectAV = additionalCalculateStat(skillStats.AV, equipmentStats.AV, jobStats.AV);
    const effectAR = additionalCalculateStat(skillStats.AR, equipmentStats.AR, jobStats.AR);
    const baseDLY = ((1000 - 50 * Math.pow(userData.userStats.dexterity, 0.3))).toFixed(0);

    return { HP, PA, MA, PD, MD, CT, CD, AV, AR, DLY, effectHP, effectPA, effectMA, effectPD, effectMD, effectCT, effectCD, effectAV, effectAR,baseDLY};
};


export const calculateEnemyStats = (enemyData) => {
    if (!enemyData) return {};

    const HP = enemyData.hp;
    const PA = enemyData.pa;
    const MA = enemyData.ma;
    const PD = enemyData.pd;
    const MD = enemyData.md;
    const CT = enemyData.ct;
    const CD = enemyData.cd;
    const AV = enemyData.av;
    const DLY = enemyData.ar;
    //const DLY = ((1000 - 50 * Math.pow(enemyData.dexterity, 0.3)) * (1 - AR / 100)).toFixed(2);

    return { HP, PA, MA, PD, MD, CT, CD, AV, DLY };
};
