import React from "react";
import PropTypes from "prop-types";
import { Button, Alert } from "react-native";
import { AuthSession } from "expo";
import * as Random from "expo-random";
import * as SecureStore from "expo-secure-store";
import jwtDecoder from "jwt-decode";
import queryString from "query-string";
import {
    AUTH_CLIENT_ID,
    AUTH_DOMAIN,
    ID_TOKEN_KEY,
    NONCE_KEY,
    AUTH_NAMESPACE
} from "../config";

const generateNonce = async () => {
    const nonce = String.fromCharCode.apply(
        null,
        await Random.getRandomBytesAsync(16)
    );
    await SecureStore.setItemAsync(NONCE_KEY, nonce);
    return nonce;
}

const Auth = ({ onLogin, onLogout, token }) => {
    const handleLoginPress = async () => {
        const nonce = await generateNonce();
        AuthSession.startAsync({
            authUrl:
            `${AUTH_DOMAIN}/authorize?` +
            queryString.stringify({
                client_id: AUTH_CLIENT_ID,
                response_type: "id_token",
                scope: "openid profile email",
                redirect_uri: AuthSession.getRedirectUrl(),
                nonce
            })
        }).then(result => {
            if (result.type === "success") {
                decodeToken(result.params.id_token);
            } else if (result.params && result.params.error) {
                Alert.alert(
                    "Error",
                    result.params.error_description || 
                        "Something went wrong while logging in."
                );
            }
        });
    };

    const decodeToken = token => {
        const decodeToken = jwtDecoder(token);
        const { nonce, sub, email, name, exp } = decodeToken;

        SecureStore.getItemAsync(NONCE_KEY).then(storedNonce => {
            if (nonce == storedNonce) {
                SecureStore.setItemAsync(
                    ID_TOKEN_KEY,
                    JSON.stringify({
                        id: sub,
                        email,
                        name,
                        exp,
                        token
                    })
                ).then(() => onLogin(decodeToken[AUTH_NAMESPACE].isNewUser));
            } else {
                Alert.alert("Error", "Nonces don't match");
                return;
            }
        })
    }

    return token ? (
        <Button title="Logout" onPress={onLogout} />
    ) : (
        <Button title="Login" onPress={handleLoginPress} />
    )
}

Auth.propTypes = {
    onLogin: PropTypes.func,
    onLohout: PropTypes.func,
    isLoggedIn: PropTypes.bool,
    token: PropTypes.string
};

export default Auth;