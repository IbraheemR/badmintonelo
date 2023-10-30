<script>
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    export let app;
    const auth = getAuth(app);

    let user;
    onAuthStateChanged(auth, (u) => {
        user = u;
    });
</script>

{#if user}
    <slot />
{:else}
    <h1>Unauthorised</h1>
    <a href="/signin">Sign In</a>
{/if}
