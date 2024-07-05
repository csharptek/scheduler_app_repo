import { MsalAuthProvider, LoginType } from 'react-aad-msal';
 
// Msal Configurations
const config = {
  auth: {
    authority: 'https://login.microsoftonline.com/common/',
    clientId: '955b16ea-da20-41ee-bc8f-f3ad71d0f21a',
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