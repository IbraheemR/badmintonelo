<script>
    export let onSubmit = (a, b) => {};

    let scoreA="", scoreB="";
</script>

<input type="number" bind:value={scoreA} /><br>
<input type="number" bind:value={scoreB} />
<button
    on:click={() => {
        onSubmit(scoreA, scoreB);
        scoreA = "";
        scoreB = "";
    }}
    >Submit Score</button
>
