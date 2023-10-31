<script>
    import { Collection } from "sveltefire";
</script>

<table>
    <Collection ref="players" let:data={players}>
        {#each players as player, i (player.id)}
            <tr>
                <td>#{i + 1}</td>
                <td>{player.name}</td>
                <td>{parseFloat(player.currentElo).toFixed(1)}</td>
            </tr>
        {/each}
    </Collection>
</table>
