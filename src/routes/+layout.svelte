<script lang="ts">
	import { FirebaseApp, SignedIn } from "sveltefire";
	import {auth, firestore} from "./firebase";

</script>

<FirebaseApp {auth} {firestore}>
	<SignedIn let:user let:signOut>
		<div>Signed In as {user.displayName ?? user.email}
			<a on:click={signOut}>[Log Out]</a>
		</div>
		<div>
			<a href="/players">[Players]</a>
			<a href="/matches">[Match Admin]</a>
			<a href="/">[Rankings]</a>
			<br>
			<br>
		</div>
	</SignedIn>

	<slot />
</FirebaseApp>
