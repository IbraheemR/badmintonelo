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
        elo1 = (eloArray[0] + eloArray[1]) / 2;
        elo2 = (eloArray[2] + eloArray[3]) / 2;
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
