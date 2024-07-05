import { MsalAuthProvider, LoginType } from 'react-aad-msal';
 
// Msal Configurations
const config = {
  auth: {
    authority: 'https://login.microsoftonline.com/common/',
    clientId: 'enter client id',
    redirectUri: 'http://localhost:3000/callback'
    // redirectUri: 'https://interviewschedulerapp.azurewebsites.net/#/'
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};
 
// Authentication Parameters
const authenticationParameters = {
  scopes: ["User.Read", "User.Read.All", "Directory.Read.All"]
}
 
// Options
const options = {
  loginType: LoginType.Redirect,
  tokenRefreshUri: window.location.origin + '/auth.html'
}
 
export const authProvider = new MsalAuthProvider(config, authenticationParameters, options)