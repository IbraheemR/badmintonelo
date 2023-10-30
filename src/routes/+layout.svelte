<script lang="ts">
	import { initializeApp } from "firebase/app";
	import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

	// Initialize Firebase
	const app = initializeApp({
		apiKey: "AIzaSyD6xmcRawzfBM4iBb3Zz9FwP3BYEc6jxdc",
		authDomain: "badmintonelo.firebaseapp.com",
		projectId: "badmintonelo",
		storageBucket: "badmintonelo.appspot.com",
		messagingSenderId: "330195930910",
		appId: "1:330195930910:web:e3e6da3b0a55aeb4fb830f",
	});

    const auth = getAuth(app);

    let user;
    onAuthStateChanged(auth, (u) => {
        user = u;
    });
</script>

{#if user}
    <div>Signed In as {user.displayName ?? user.email}</div>
    <div on:click={() => signOut(auth)}>[Log Out]</div>
{/if}

<slot {app} {auth}/>
