package com.aditi.moneymanager.security;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

@Service
public class JWTSecurity {

    private static final String jwtKey = System.getProperty("JWT_KEY");
    private static final long jwtExpiry = Long.parseLong(System.getProperty("JWT_EXPIRY"));

    public String getJwtToken(String username) {
        String token = JWT.create().withSubject(username).withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpiry))
                .sign(Algorithm.HMAC256(jwtKey));
        return token;
    }
}
