var ref = new Firebase("https://blistering-heat-2157.firebaseio.com");
var authData = ref.getAuth();

if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  console.log("User is logged out");
}

// Create a callback to handle the result of the authentication
function authHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
    console.log("Login Failed!", authData);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}

// Authenticate users with a custom Firebase token
//ref.authWithCustomToken("<token>", authHandler);

// Alternatively, authenticate users anonymously
//ref.authAnonymously(authHandler);

// Or with an email/password combination
ref.authWithPassword({
  email    : 'bobtony@firebase.com',
  password : 'correcthorsebatterystaple'
}, authHandler);

// Or via popular OAuth providers ("facebook", "github", "google", or "twitter")
//ref.authWithOAuthRedirect("facebook", authHandler);
//ref.authWithOAuthRedirect("google", authHandler);
