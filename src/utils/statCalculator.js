export const calculateStat = (base, skill, equipment, job) => {
    return (base * (1 + 0.01 * (skill + equipment + job))).toFixed(0);
};

export const calculateUserStats = (userData) => {
    if (!userData) return {};

    const { baseStats, skillStats, equipmentStats, jobStats } = userData.combat;

    const HP = calculateStat(baseStats.HP, skillStats.HP, equipmentStats.HP, jobStats.HP);
    const PA = calculateStat(baseStats.PA, skillStats.PA, equipmentStats.PA, jobStats.PA);
    const MA = calculateStat(baseStats.MA, skillStats.MA, equipmentStats.MA, jobStats.MA);
    const PD = calculateStat(baseStats.PD, skillStats.PD, equipmentStats.PD, jobStats.PD);
    const MD = calculateStat(baseStats.MD, skillStats.MD, equipmentStats.MD, jobStats.MD);
    const CT = calculateStat(baseStats.CT, skillStats.CT, equipmentStats.CT, jobStats.CT);
    const CD = calculateStat(baseStats.CD, skillStats.CD, equipmentStats.CD, jobStats.CD);
    const AV = calculateStat(baseStats.AV, skillStats.AV, equipmentStats.AV, jobStats.AV);
    const AR = calculateStat(baseStats.AR, skillStats.AR, equipmentStats.AR, jobStats.AR);
    const DLY = ((1000 - 50 * Math.pow(userData.userStats.dexterity, 0.3)) * (1 - AR / 100)).toFixed(0);

    return { HP, PA, MA, PD, MD, CT, CD, AV, DLY};
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
