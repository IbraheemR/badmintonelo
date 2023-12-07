export const STARTING_ELO = 1000;
export const K =  50;
export const PP10 = 400;


export function calculateEloPointGain(eloA, eloB, scoreA, scoreB): [boolean, number] {
    const expectation = 1 / (1 + Math.pow(10, (eloB - eloA) / PP10));

    const outcome = scoreA / (scoreA + scoreB);

    const pointGain = K * (outcome - expectation);

    const valid = isFinite(pointGain);

    return [valid, pointGain];
}

export function getEloMeansFromMatchArray(eloArray) {
    let elo1, elo2;
    if (eloArray.length == 2) {
        elo1 = eloArray[0];
        elo2 = eloArray[1];
    } else {
        let elo1min = Math.min(eloArray[0] + eloArray[1]);
        let elo1max = Math.max(eloArray[0] + eloArray[1]);
        let elo2min = Math.min(eloArray[2] + eloArray[3]);
        let elo2max = Math.max(eloArray[2] + eloArray[3]);

        elo1 = (elo1min * 0.75 + elo1max * 0.25);
        elo2 = (elo2min * 0.75 + elo2max * 0.25);
    }

    return [elo1, elo2]
}

export function generateNewElos(oldElosArray, scoreA, scoreB): [boolean, number[], number] {
    let [eloA, eloB] = getEloMeansFromMatchArray(oldElosArray);
    let [valid, pointGain] = calculateEloPointGain(eloA, eloB, scoreA, scoreB);
    if (oldElosArray.length == 2) {
        return [valid, [
            oldElosArray[0] + pointGain,
            oldElosArray[1] - pointGain
        ], pointGain]
    } else {
        return [valid, [
            oldElosArray[0] + pointGain,
            oldElosArray[1] + pointGain,
            oldElosArray[2] - pointGain,
            oldElosArray[3] - pointGain
        ], pointGain]
    }
}
