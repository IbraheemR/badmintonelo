<script lang="ts">
    import { addDoc, updateDoc } from "firebase/firestore";
    import { Collection, SignedIn, SignedOut } from "sveltefire";
    import { STARTING_ELO } from "../matches/elo";

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

        <table>
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
                </tr>
            {/each}
        </table>
    </Collection>
</SignedIn>
