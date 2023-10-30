<script>
    import {
        addDoc,
        collection,
        doc,
        getDoc,
        getFirestore,
        onSnapshot,
        orderBy,
        query,
        setDoc,
        updateDoc,
    } from "firebase/firestore";
    import { getAuth } from "firebase/auth";
    import { onDestroy } from "svelte";

    import ScoreInput from "./ScoreInput.svelte";
    import NeedsSignIn from "../NeedsSignIn.svelte";

    export let app;

    let firestore = getFirestore(app);

    let matchesCollection = collection(firestore, "matches");

    let matches = [];

    const unsubscribeMatches = onSnapshot(matchesCollection, (snapshot) => {
        matches = snapshot.docs.map((doc) => ({
            ref: doc.ref,
            id: doc.id,
            ...doc.data(),
        }));
    });

    onDestroy(() => unsubscribeMatches());

    let playersCollection = collection(firestore, "players");

    let players = [];

    const unsubscribePlayers = onSnapshot(
        query(playersCollection, orderBy("lastUpdate")),
        (snapshot) => {
            players = snapshot.docs.map((doc) => ({
                ref: doc.ref,
                id: doc.id,
                ...doc.data(),
            }));
            currentMatches = currentMatches;
        }
    );

    onDestroy(() => unsubscribePlayers());

    let currentMatches = [];
    for (let index = 0; index < 8; index++) {
        currentMatches.push([]);
    }

    function getPlayerFromId(id) {
        let p = players.filter((v) => v.id === id)[0];
        return p;
    }

    function getPlayerNameFromId(id) {
        if (!id) return "";
        let p = getPlayerFromId(id);
        if (!p) return "";

        return `${p.name} ${parseFloat(p.currentElo).toFixed(1)}`;
    }

    function addPlayerToCourt(id, court) {
        if (!id) return;
        if (court.length == 4) return;
        if (court.includes(id)) return;

        court.push(id);

        currentMatches = currentMatches;
        selectedPlayer = "";
    }

    let selectedPlayer = "";

    function performMatchEloUpdate(scoreA, scoreB, match) {
        let result = scoreA / (scoreA + scoreB);

        let playerData = match.map((m) => getPlayerFromId(m));

        let elos = playerData.map((p) => parseFloat(p.currentElo));

        let elo1, elo2;
        if (match.length == 2) {
            elo1 = elos[0];
            elo2 = elos[1];
        } else {
            elo1 = (elos[0] + elos[1]) / 2;
            elo2 = (elos[2] + elos[3]) / 2;
        }

        let expectation = 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));

        let diff = result - expectation;

        let pointGain = 15 * diff;

        if (!isFinite(pointGain)) return;

        if (match.length == 2) {
            updatePlayerElo(match[0], elos[0] + pointGain);
            updatePlayerElo(match[1], elos[1] - pointGain);
        } else {
            updatePlayerElo(match[0], elos[0] + pointGain);
            updatePlayerElo(match[1], elos[1] + pointGain);
            updatePlayerElo(match[2], elos[2] - pointGain);
            updatePlayerElo(match[3], elos[3] - pointGain);
        }

        let playersObj = {};
        if (match.length == 2) {
            playersObj["player1A"] = match[0];
            playersObj["player1B"] = "";
            playersObj["player2A"] = match[1];
            playersObj["player2B"] = "";

            playersObj["player1AOldElo"] = elos[0];
            playersObj["player1BOldElo"] = 0;
            playersObj["player2AOldElo"] = elos[1];
            playersObj["player2BOldElo"] = 0;
        } else {
            playersObj["player1A"] = match[0];
            playersObj["player1B"] = match[1];
            playersObj["player2A"] = match[2];
            playersObj["player2B"] = match[3];

            playersObj["player1AOldElo"] = elos[0];
            playersObj["player1BOldElo"] = elos[1];
            playersObj["player2AOldElo"] = elos[2];
            playersObj["player2BOldElo"] = elos[3];
        }

        addDoc(matchesCollection, {
            ...playersObj,
            completedAt: Date.now(),
            pointGain,
            scoreA,
            scoreB,
        });
    }

    function updatePlayerElo(id, newElo) {
        let playerRef = doc(firestore, `players/${id}`);
        updateDoc(playerRef, {
            ...getPlayerFromId(id),
            currentElo: newElo,
            lastUpdate: Date.now(),
        });
    }
</script>

<NeedsSignIn {app}>
    <h1>Current Matches</h1>
    <div style="display: flex; flex-wrap: wrap;">
        {#each currentMatches as match, mi}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                style="min-width: 300px; width: 20%; border: 1px solid black;"
                on:click={() => addPlayerToCourt(selectedPlayer, match)}
            >
                <h2>Court {mi + 1}</h2>
                {#each match as player, pi}
                    <div>
                        <span
                            style="background: red; cursor: pointer;"
                            on:click={() => {
                                match.splice(pi, 1);
                                currentMatches = currentMatches;
                            }}>[X]</span
                        >
                        {getPlayerNameFromId(player)} &nbsp;
                    </div>
                {/each}

                <ScoreInput
                    onSubmit={(a, b) => {
                        performMatchEloUpdate(a, b, match);
                        match = [];
                    }}
                />
            </div>
        {/each}
    </div>

    <h1>Available Players</h1>
    <table>
        {#each players as { ref, id, ...player } (id)}
            {#if !currentMatches.some((c) => c.includes(id))}
                <tr
                    on:click={() =>
                        (selectedPlayer = selectedPlayer == id ? "" : id)}
                    style={selectedPlayer == id
                        ? "font-weight: bold; cursor:pointer;"
                        : "cursor:pointer;"}
                >
                    <td>{player.name}</td>
                    <td>{parseFloat(player.currentElo).toFixed(1)}</td>
                </tr>
            {/if}
        {/each}
    </table>
</NeedsSignIn>
