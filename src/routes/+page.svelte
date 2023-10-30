<script>
    import {
        addDoc,
        collection,
        deleteDoc,
        getFirestore,
        onSnapshot,
        orderBy,
        query,
        where,
    } from "firebase/firestore";
    import { onDestroy, onMount } from "svelte";

    export let app;

    let firestore = getFirestore(app);

    let testCollection = collection(firestore, "players");

    let players = [];

    let newPlayerNames = "";

    const unsubscribe = onSnapshot(
        query(
            testCollection,
            orderBy("currentElo", "desc"),
            where("hideInLeague", "==", false)
        ),
        (snapshot) => {
            players = snapshot.docs.map((doc) => ({
                ref: doc.ref,
                id: doc.id,
                ...doc.data(),
            }));
        }
    );

    onDestroy(() => unsubscribe());
</script>

<table>
    {#each players as player, i (player.id)}
        <tr>
            <td>#{i + 1}</td>
            <td>{player.name}</td>
            <td>{parseFloat(player.currentElo).toFixed(1)}</td>
        </tr>
    {/each}
</table>
