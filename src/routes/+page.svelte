<script>
    import { Collection } from "sveltefire";
    import { firestore } from "./firebase";
    import { collection, query, orderBy } from "firebase/firestore";
    const ratedPlayersQuery = query(
        collection(firestore, "players"),
        orderBy("currentElo", "desc")
    );
</script>

<table>
    <Collection ref={ratedPlayersQuery} let:data={players}>
        {#each players as player, i (player.id)}
            <tr>
                <td>#{i + 1}</td>
                <td>{player.name}</td>
                <td>{parseFloat(player.currentElo).toFixed(1)}</td>
            </tr>
        {/each}
    </Collection>
</table>
