<script>
    import {
        signInWithEmailAndPassword,
        getAuth,
        onAuthStateChanged,
    } from "firebase/auth";

    export let app;

    const auth = getAuth(app);

    async function attemptSignIn() {
        error = "";
        let credential;
        try {
            credential = await signInWithEmailAndPassword(
                auth,
                username,
                password
            );
        } catch (e) {
            error = e;

            user = credential.user;
        }
    }

    let username, password;
    let error = "";

    let user;
    onAuthStateChanged(auth, (u) => {
        user = u;
    });
</script>

{#if !user}
    <input type="text" bind:value={username} />
    <input type="password" bind:value={password} />
    <button on:click={attemptSignIn}>Signin</button>

    <div style="color: red;">{error}</div>
{/if}
