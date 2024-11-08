export const calculateStat1 = (base, skill, equipment, job) => {
    return (base * (1 + 0.01 * (skill + equipment + job))).toFixed(1);
};

export const calculateStat2 = (base, skill, equipment, job) => {
    return (base + skill + equipment + job).toFixed(1);
};

export const additionalCalculateStat = (skill, equipment, job) => {
    return (skill + equipment + job).toFixed(1);
};

export const calculateUserStats = (userData, equipmentStats = {}, skillStats = {}, jobStats = {}) => {

    const { baseStats } = userData.combat;

    // 기본값을 설정하여 undefined 또는 null을 피함
    const safeGet = (stat, defaultValue = 0) => stat != null ? stat : defaultValue;

    const HP = calculateStat1(safeGet(baseStats.HP), safeGet(skillStats.HP), safeGet(equipmentStats.HP), safeGet(jobStats.HP));
    const PA = calculateStat1(safeGet(baseStats.PA), safeGet(skillStats.PA), safeGet(equipmentStats.PA), safeGet(jobStats.PA));
    const MA = calculateStat1(safeGet(baseStats.MA), safeGet(skillStats.MA), safeGet(equipmentStats.MA), safeGet(jobStats.MA));
    const PD = calculateStat2(safeGet(baseStats.PD), safeGet(skillStats.PD), safeGet(equipmentStats.PD), safeGet(jobStats.PD));
    const MD = calculateStat2(safeGet(baseStats.MD), safeGet(skillStats.MD), safeGet(equipmentStats.MD), safeGet(jobStats.MD));
    const CT = calculateStat2(safeGet(baseStats.CT), safeGet(skillStats.CT), safeGet(equipmentStats.CT), safeGet(jobStats.CT));
    const CD = calculateStat2(safeGet(baseStats.CD), safeGet(skillStats.CD), safeGet(equipmentStats.CD), safeGet(jobStats.CD));
    const AV = calculateStat2(safeGet(baseStats.AV), safeGet(skillStats.AV), safeGet(equipmentStats.AV), safeGet(jobStats.AV));
    const AR = calculateStat2(safeGet(baseStats.AR), safeGet(skillStats.AR), safeGet(equipmentStats.AR), safeGet(jobStats.AR));

    const DLY = ((1000 - 50 * Math.pow(safeGet(userData.userStats.dexterity), 0.3)) * (1 - safeGet(AR) / 100)).toFixed(0);

    const effectHP = additionalCalculateStat(safeGet(skillStats.HP), safeGet(equipmentStats.HP), safeGet(jobStats.HP));
    const effectPA = additionalCalculateStat(safeGet(skillStats.PA), safeGet(equipmentStats.PA), safeGet(jobStats.PA));
    const effectMA = additionalCalculateStat(safeGet(skillStats.MA), safeGet(equipmentStats.MA), safeGet(jobStats.MA));
    const effectPD = additionalCalculateStat(safeGet(skillStats.PD), safeGet(equipmentStats.PD), safeGet(jobStats.PD));
    const effectMD = additionalCalculateStat(safeGet(skillStats.MD), safeGet(equipmentStats.MD), safeGet(jobStats.MD));
    const effectCT = additionalCalculateStat(safeGet(skillStats.CT), safeGet(equipmentStats.CT), safeGet(jobStats.CT));
    const effectCD = additionalCalculateStat(safeGet(skillStats.CD), safeGet(equipmentStats.CD), safeGet(jobStats.CD));
    const effectAV = additionalCalculateStat(safeGet(skillStats.AV), safeGet(equipmentStats.AV), safeGet(jobStats.AV));
    const effectAR = additionalCalculateStat(safeGet(skillStats.AR), safeGet(equipmentStats.AR), safeGet(jobStats.AR));

    const baseDLY = ((1000 - 50 * Math.pow(safeGet(userData.userStats.dexterity), 0.3))).toFixed(0);

    return {
        HP, PA, MA, PD, MD, CT, CD, AV, AR, DLY,
        effectHP, effectPA, effectMA, effectPD, effectMD, effectCT, effectCD, effectAV, effectAR,
        baseDLY
    };
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

export const statsList = [
    {label: "HP", key: "effectHP", stats: ["HP"]},
    {label: "PA", key: "effectPA", stats: ["PA"]},
    {label: "MA", key: "effectMA", stats: ["MA"]},
    {label: "PD", key: "effectPD", stats: ["PD"]},
    {label: "MD", key: "effectMD", stats: ["MD"]},
    {label: "CT", key: "effectCT", stats: ["CT"]},
    {label: "CD", key: "effectCD", stats: ["CD"]},
    {label: "AV", key: "effectAV", stats: ["AV"]},
    {label: "AR", key: "effectAR", stats: ["AR"]}
];
