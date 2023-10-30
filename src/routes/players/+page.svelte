<script lang="ts">
    import {
        addDoc,
        collection,
        deleteDoc,
        doc,
        getFirestore,
        onSnapshot,
        setDoc,
    } from "firebase/firestore";
    import { onDestroy } from "svelte";
    import NeedsSignIn from "../NeedsSignIn.svelte";

    export let app;

    let firestore = getFirestore(app);

    let testCollection = collection(firestore, "players");

    let players = [];

    let newPlayerNames = "";

    const unsubscribe = onSnapshot(testCollection, (snapshot) => {
        players = snapshot.docs.map((doc) => ({
            ref: doc.ref,
            id: doc.id,
            ...doc.data(),
        }));
    });

    onDestroy(() => unsubscribe());
</script>

<NeedsSignIn {app}>
    <div>
        <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            bind:value={newPlayerNames}
        />
        <button
            on:click={() => {
                let names = newPlayerNames.split("\n").filter((x) => x);
                for (const name of names) {
                    addDoc(testCollection, {
                        name: name,
                        currentElo: 1000,
                        hideInLeague: false,
                        lastUpdate: 0,
                    });
                }
            }}
        >
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
                        setDoc(ref, {
                            ...player,
                            hideInLeague: !player.hideInLeague,
                        })}
                    >{#if player.hideInLeague}[Hidden]{:else}[Hide in league]{/if}</td
                >
            </tr>
        {/each}
    </table>
</NeedsSignIn>
