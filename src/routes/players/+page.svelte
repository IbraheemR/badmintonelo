<script lang="ts">
    import {
        addDoc,
        collection,
        orderBy,
        query,
        updateDoc,
    } from "firebase/firestore";
    import { Collection, SignedIn, SignedOut } from "sveltefire";
    import { STARTING_ELO } from "../matches/elo";
    import { firestore } from "../firebase";

    let newPlayerNames = "";
    function addNewPlayers(playersCollection) {
        let names = newPlayerNames.split("\n").filter((x) => x);
        for (const name of names) {
            addDoc(playersCollection, {
                name: name,
                currentElo: STARTING_ELO,
                hideInLeague: false,
                lastUpdate: 0,
            });
        }

        newPlayerNames = "";
    }
</script>

<SignedOut>
    <h1>Unauthorised</h1>
    <a href="/signin">Sign In</a>
</SignedOut>

<SignedIn>
    <Collection ref="players" let:data={players} let:ref={playersCollection}>
        <div>
            <textarea bind:value={newPlayerNames} />
            <button on:click={() => addNewPlayers(playersCollection)}>
                Add
            </button>
        </div>

        <p>Doesn't handle duplicates!!!</p>
        <p>
            <a
                href="https://console.firebase.google.com/project/badmintonelo/firestore"
                >Firestore</a
            >
        </p>

        <br />

        <br />

        <table>
            <tr>
                <td />
                <td />
                <td />
                <td />
                <td>
                    <button
                        on:click={() => {
                            players.forEach(({ ref }) => {
                                updateDoc(ref, { present: false });
                            });
                        }}>Clear All Present</button
                    >
                </td>
            </tr>
            {#each players as { ref, id, ...player } (id)}
                <tr>
                    <td>{id}</td>
                    <td>{player.name}</td>
                    <td>{parseFloat(player.currentElo).toFixed(1)}</td>
                    <td
                        style="cursor: pointer;"
                        on:click={() =>
                            updateDoc(ref, {
                                hideInLeague: !player.hideInLeague,
                            })}
                        >{#if player.hideInLeague}[Hidden]{:else}[Hide in
                            Rankings]{/if}</td
                    >
                    <td
                        style="cursor: pointer;"
                        on:click={() =>
                            updateDoc(ref, {
                                present: !player.present,
                            })}
                        >{#if player.present}[Present]{:else}[Mark Present]{/if}</td
                    >
                </tr>
            {/each}
        </table>
    </Collection>
</SignedIn>
