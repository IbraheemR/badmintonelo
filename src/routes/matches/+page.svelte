<script>
    import {
        addDoc,
        collection,
        doc,
        orderBy,
        query,
        updateDoc,
    } from "firebase/firestore";
    import {
        Collection,
        SignedIn,
        SignedOut,
        collectionStore,
    } from "sveltefire";

    import ScoreInput from "./ScoreInput.svelte";
    import { firestore } from "../firebase";
    import { generateNewElos } from "./elo";

    let matchesCollection = collection(firestore, "matches");

    let currentMatches = [];
    for (let index = 0; index < 8; index++) {
        currentMatches.push([]);
    }

    const players = collectionStore(firestore, "players");

    function getPlayerFromId(id) {
        let p = $players.filter((v) => v.id === id)[0];
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

    function performMatchEloUpdate(scoreA, scoreB, playerIds) {

        let elos = playerIds.map((m) => getPlayerFromId(m).currentElo);

        let [valid, newElos, pointGain] = generateNewElos(elos, scoreA, scoreB);

        if (!valid) return;

        playerIds.forEach((pId, i) => {
            console.log(pId, i)
            updatePlayerElo(pId, newElos[i])
        })

        let playersObj = {};
        if (playerIds.length == 2) {
            playersObj["player1A"] = playerIds[0];
            playersObj["player1B"] = "";
            playersObj["player2A"] = playerIds[1];
            playersObj["player2B"] = "";

            playersObj["player1AOldElo"] = elos[0];
            playersObj["player1BOldElo"] = 0;
            playersObj["player2AOldElo"] = elos[1];
            playersObj["player2BOldElo"] = 0;
        } else {
            playersObj["player1A"] = playerIds[0];
            playersObj["player1B"] = playerIds[1];
            playersObj["player2A"] = playerIds[2];
            playersObj["player2B"] = playerIds[3];

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
        console.log(newElo);
        let playerRef = doc(firestore, `players/${id}`);
        updateDoc(playerRef, {
            currentElo: newElo,
            lastUpdate: Date.now(),
        });
    }
</script>

<SignedOut>
    <h1>Unauthorised</h1>
    <a href="/signin">Sign In</a>
</SignedOut>

<SignedIn>
    <h1>Current Matches</h1>
    <p>Warning: will clear if page refreshes</p>
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
        <Collection
            ref={query(collection(firestore, "players"), orderBy("lastUpdate"))}
            let:data={players}
        >
            {#each players as player (player.id)}
                {#if !currentMatches.some((c) => c.includes(player.id))}
                    <tr
                        on:click={() =>
                            (selectedPlayer =
                                selectedPlayer == player.id ? "" : player.id)}
                        style={selectedPlayer == player.id
                            ? "font-weight: bold; cursor:pointer;"
                            : "cursor:pointer;"}
                    >
                        <td>{player.name}</td>
                        <td>{parseFloat(player.currentElo).toFixed(1)}</td>
                    </tr>
                {/if}
            {/each}
        </Collection>
    </table>
</SignedIn>
