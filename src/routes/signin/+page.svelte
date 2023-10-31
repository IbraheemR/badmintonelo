<script>
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { SignedOut } from "sveltefire";

    async function attemptSignIn(auth) {
        error = "";
        try {
            await signInWithEmailAndPassword(auth, username, password);
        } catch (e) {
            error = e;
        }
    }

    let username, password;
    let error = "";
</script>

<SignedOut let:auth>
    <input type="text" bind:value={username} />
    <input type="password" bind:value={password} />
    <button on:click={() => attemptSignIn(auth)}>Signin</button>

    <div style="color: red;">{error}</div>
</SignedOut>
